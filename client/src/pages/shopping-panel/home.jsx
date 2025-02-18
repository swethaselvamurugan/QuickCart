import { Button } from "@/components/ui/button";
import adidas from "../../assets/adidas.png";
import handm from "../../assets/handm.png";
import nike from "../../assets/nike.png";
import puma from "../../assets/puma.png";
import reebok from "../../assets/reebok.png";
import zara from "../../assets/zara.png";
import men from "../../assets/men.png";
import women from "../../assets/women.png";
import kids from "../../assets/kids.png";
import accessories from "../../assets/accessories.png";
import footwear from "../../assets/footwear.png";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { useNavigate } from "react-router-dom";
import ShoppingProductTile from "@/components/shopping-panel/product-tile";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import ProductDetailsDialog from "@/components/shopping-panel/product-details";
import { getFeatureImages } from "@/store/common/feature-slice";

function ShoppingHome() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { productList, productDetails } = useSelector(state => state.shopProducts);
    const { user } = useSelector(state => state.auth);
    const { cartItems } = useSelector(state => state.shopCart);
    const { featureImageList } = useSelector(state => state.commonFeature);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [currentslide, setCurrentSlide] = useState(0);
    const categoriesWithIcon = [
        { id: "men", label: "Men", icon: men },
        { id: "women", label: "Women", icon: women },
        { id: "kids", label: "Kids", icon: kids },
        { id: "accessories", label: "Accessories", icon: accessories },
        { id: "footwear", label: "Footwear", icon: footwear },
    ];
    const brandsWithIcon = [
        { id: "nike", label: "Nike", icon: nike },
        { id: "adidas", label: "Adidas", icon: adidas },
        { id: "puma", label: "Puma", icon: puma },
        { id: "reebok", label: "Reebok", icon: reebok },
        { id: "zara", label: "Zara", icon: zara },
        { id: "h&m", label: "H&M", icon: handm },
    ];

    function handleNavigateToListingPage(getCurrentItem, section) {
        sessionStorage.removeItem("Filter");
        const currentFilter = { [section]: [getCurrentItem.id] };
        sessionStorage.setItem("Filter", JSON.stringify(currentFilter));
        navigate("/shop/listing");
    }

    function handleGetProductDetails(getCurrentProductID) {
        console.log(getCurrentProductID);
        dispatch(fetchProductDetails(getCurrentProductID))
    }

    function handleAddtoCart(getCurrentProductID) {
        let getCartItems = cartItems.items || [];
        if (getCartItems.length) {
            const indexOfCurrentItem = getCartItems.findIndex((item) => item.productId === getCurrentProductID);
            const getCurrentProductIndex = productList.findIndex((item) => item._id === getCurrentProductID);
            const getTotalStock = productList[getCurrentProductIndex].totalstock;
            if (indexOfCurrentItem > -1) {
                const getQuantity = getCartItems[indexOfCurrentItem].quantity;
                if (getQuantity + 1 > getTotalStock) {
                    toast({ title: `Only ${getQuantity} quantity can be added for this item.`, variant: "destructive" });
                    return;
                }
            }
        }
        console.log(getCurrentProductID, "Add to Cart: Product ID");
        dispatch(addToCart({ userId: user?.id, productId: getCurrentProductID, quantity: 1 }))
            .then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchCartItems(user?.id));
                    toast({ title: "Product is added to cart." })
                }
            })
    }

    useEffect(() => {
        const timer = setInterval(() => { setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length); }, 3000);
        return () => clearInterval(timer);
    }, [featureImageList]);

    useEffect(() => {
        dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }))
    }, [dispatch])

    useEffect(() => {
        if (productDetails !== null) setOpenDetailsDialog(true)
    }, [productDetails])

    useEffect(() => {
            dispatch(getFeatureImages());
        }, [dispatch])

    console.log(productList, "Product List in Home Page");

    return (
        <div className="flex flex-col min-h-screen">
            <div className="relative w-full h-[600px] overflow-hidden">
                {
                    featureImageList && featureImageList.length > 0 ?
                    featureImageList.map((slide, index) => <img src={slide?.image} key={index} className={` ${index === currentslide ? "opacity-100" : "opacity-0"} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`} />) : null
                }
                <Button onClick={() => setCurrentSlide((prevSlide) => (prevSlide - 1 + featureImageList.length) % featureImageList.length)} variant="outline" size="icon" className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80">
                    <ChevronLeftIcon className="w-4 h-4" />
                </Button>
                <Button onClick={() => setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length)} variant="outline" size="icon" className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80">
                    <ChevronRightIcon className="w-4 h-4" />
                </Button>
            </div>
            <section className="py-12 bg-grey-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Shop by category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {
                            categoriesWithIcon.map((item) => <Card onClick={() => handleNavigateToListingPage(item, "category")} className="cursor-pointer hover:shadow-lg transition-shadow">
                                <CardContent className="flex flex-col items-center justify-center p-6">
                                    <img src={item.icon} className="w-12 h-12 mb-4 text-primary" />
                                    <span className="font-bold">{item.label}</span>
                                </CardContent>
                            </Card>)
                        }
                    </div>
                </div>
            </section>
            <section className="py-12 bg-grey-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Shop by brand</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {
                            brandsWithIcon.map((item) => <Card onClick={() => handleNavigateToListingPage(item, "brand")} className="cursor-pointer hover:shadow-lg transition-shadow">
                                <CardContent className="flex flex-col items-center justify-center p-6">
                                    <img src={item.icon} className="w-12 h-12 mb-4 text-primary" />
                                    <span className="font-bold">{item.label}</span>
                                </CardContent>
                            </Card>)
                        }
                    </div>
                </div>
            </section>
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Feature Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {
                            productList && productList.length > 0 ?
                                productList.map((item) => <ShoppingProductTile handleGetProductDetails={handleGetProductDetails} handleAddtoCart={handleAddtoCart} product={item} />) : null
                        }
                    </div>
                </div>
            </section>
            <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
        </div>
    )
}

export default ShoppingHome;