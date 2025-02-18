import ProductDetailsDialog from "@/components/shopping-panel/product-details";
import ShoppingProductTile from "@/components/shopping-panel/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { getSeachResults, resetSearchResults } from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function SearchProducts() {

    const [keyword, setKeyword] = useState();
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const { user } = useSelector(state => state.auth);
    const { productDetails } = useSelector(state => state.shopProducts);
    const { searchResults } = useSelector(state => state.shopSearch);
    const { cartItems } = useSelector(state => state.shopCart);
    const dispatch = useDispatch();
    const { toast } = useToast();

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
        if (productDetails !== null) setOpenDetailsDialog(true)
    }, [productDetails])

    useEffect(() => {
        if (keyword && keyword.trim() !== "" && keyword.trim().length > 3) {
            setTimeout(() => {
                setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
                dispatch(getSeachResults(keyword));
            }, 1000)
        } else {
            setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
            dispatch(resetSearchResults());
        }
    }, [keyword])

    console.log(searchResults, "Search Results")

    return (
        <div className="container mx-auto md:px-6 px-4 py-8">
            <div className="flex justify-center mb-8">
                <div className="w-full flex items-center">
                    <Input value={keyword} name="keyword" onChange={(event) => setKeyword(event.target.value)} className="py-6" placeholder="Search Products..." />
                </div>
            </div>
            {
                !searchResults.length ? <h1 className="text-5xl font-extrabold">No results found!</h1> : null
            }
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {
                    searchResults.map((item) => <ShoppingProductTile product={item} handleAddtoCart={handleAddtoCart} handleGetProductDetails={handleGetProductDetails} />)
                }
            </div>
            <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
        </div>
    )
}

export default SearchProducts;