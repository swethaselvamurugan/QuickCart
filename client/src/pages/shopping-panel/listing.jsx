import ProductFilter from "@/components/shopping-panel/filter";
import { Button } from "@/components/ui/button";
import { ArrowUpDownIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-panel/product-tile";
import { useSearchParams } from "react-router-dom";
import ProductDetailsDialog from "@/components/shopping-panel/product-details";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";

function createSeachParamsHelper(filterParams) {
    const queryParams = [];
    for (const [key, value] of Object.entries(filterParams)) {
        if (Array.isArray(value) && value.length > 0) {
            const paramValue = value.join(",")
            queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)
        }
    }
    return queryParams.join("&")
}

function ShoppingListing() {

    const dispatch = useDispatch();
    const { productList, productDetails } = useSelector(state => state.shopProducts);
    const { user } = useSelector(state => state.auth);
    const { cartItems } = useSelector(state => state.shopCart);
    const [filter, setFilter] = useState({});
    const [sort, setSort] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const { toast } = useToast();
    const categorySearchParam = searchParams.get("category")
    console.log("Filters", searchParams.toString(), filter);

    function handleSort(value) {
        setSort(value);
    }

    function handleFilter(getSectionID, getCurrentOption) {
        console.log(getSectionID, getCurrentOption);
        let copyFilter = { ...filter };
        const indexOfCurrentSection = Object.keys(copyFilter).indexOf(getSectionID);
        if (indexOfCurrentSection === -1) {
            copyFilter = {
                ...copyFilter, [getSectionID]: [getCurrentOption]
            }
        } else {
            const indexOfCurrentOption = copyFilter[getSectionID].indexOf(getCurrentOption);
            if (indexOfCurrentOption === -1) copyFilter[getSectionID].push(getCurrentOption)
            else copyFilter[getSectionID].splice(indexOfCurrentOption, 1)
        }
        console.log(copyFilter);
        setFilter(copyFilter);
        sessionStorage.setItem("Filter", JSON.stringify(copyFilter));
    }

    function handleGetProductDetails(getCurrentProductID) {
        console.log(getCurrentProductID);
        dispatch(fetchProductDetails(getCurrentProductID))
    }

    function handleAddtoCart(getCurrentProductID, getTotalStock) {
        console.log(getCurrentProductID, "Add to Cart: Product ID");
        let getCartItems = cartItems.items || [];
        if (getCartItems.length) {
            const indexOfCurrentItem = getCartItems.findIndex((item) => item.productId === getCurrentProductID);
            if (indexOfCurrentItem > -1) {
                const getQuantity = getCartItems[indexOfCurrentItem].quantity;
                if (getQuantity + 1 > getTotalStock) {
                    toast({ title: `Only ${getQuantity} quantity can be added for this item.`, variant: "destructive" });
                    return;
                }
            }
        }
        dispatch(addToCart({ userId: user?.id, productId: getCurrentProductID, quantity: 1 }))
            .then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchCartItems(user?.id));
                    toast({ title: "Product is added to cart." })
                }
            })
    }

    useEffect(() => {
        if (filter && Object.keys(filter).length > 0) {
            const createQueryString = createSeachParamsHelper(filter);
            setSearchParams(new URLSearchParams(createQueryString));
        }
    }, [filter])

    useEffect(() => {
        setSort("price-lowtohigh");
        setFilter(JSON.parse(sessionStorage.getItem("Filter")) || {})
    }, [categorySearchParam])

    useEffect(() => {
        if (filter !== null && sort !== null)
            dispatch(fetchAllFilteredProducts({ filterParams: filter, sortParams: sort }))
    }, [dispatch, sort, filter])

    useEffect(() => {
        if (productDetails !== null) setOpenDetailsDialog(true)
    }, [productDetails])

    console.log(productList, "Product List");

    return (
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
            <ProductFilter filter={filter} handleFilter={handleFilter} />
            <div className="bg-background w-full rounded-lg shadow-sm">
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-lg font-extrabold">All Products</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">{productList?.length} Products</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-1"><ArrowUpDownIcon className="h-4 w-4" /><span>Sort by</span></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                                    {
                                        sortOptions.map((item) => <DropdownMenuRadioItem value={item.id} key={item.id}>{item.label}</DropdownMenuRadioItem>)
                                    }
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    {
                        productList && productList.length > 0 ? productList.map((item) => <ShoppingProductTile handleAddtoCart={handleAddtoCart} product={item} handleGetProductDetails={handleGetProductDetails} />) : null
                    }
                </div>
            </div>
            <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
        </div>
    )
}

export default ShoppingListing;