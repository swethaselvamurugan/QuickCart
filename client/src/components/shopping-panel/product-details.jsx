import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRating from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {

    const dispatch = useDispatch();
    const { toast } = useToast();
    const { user } = useSelector(state => state.auth);
    const { cartItems } = useSelector(state => state.shopCart);
    const [reviewMsg, setReviewMsg] = useState("");
    const [rating, setRating] = useState(0);
    const { reviews } = useSelector(state => state.shopReview);
    const averageReview = reviews && reviews.length > 0 ?
        reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / reviews.length : 0;

    function handleRatingChange(getRating) {
        setRating(getRating)
    }

    function handleAddReview() {
        dispatch(addReview({ productId: productDetails?._id, userId: user?.id, username: user?.username, reviewMessage: reviewMsg, reviewValue: rating }))
            .then((data) => {
                if (data?.payload?.success) {
                    setRating(0);
                    setReviewMsg("");
                    dispatch(getReviews(productDetails?._id));
                    toast({ title: "Review added successfully." })
                }
            })
    }

    function handleAddtoCart(getCurrentProductID, getTotalStock) {
        console.log(getCurrentProductID, "Add to Cart: Product ID");
        console.log(cartItems, "Cart items in handleAddToCart");
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

    function handleDialogClose() {
        setOpen(false);
        dispatch(setProductDetails());
        setRating(0);
        setReviewMsg("");
    }

    useEffect(() => {
        if (productDetails !== null) {
            dispatch(getReviews(productDetails?._id))
        }
    }, [productDetails])

    console.log(reviews, "Reviews")

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
                <div className="relative overflow-hidden rounded-lg">
                    <img src={productDetails?.image} alt={productDetails?.title} width={600} height={600} className="aspect-square w-full object-cover" />
                </div>
                <div>
                    <div>
                        <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
                        <p className="text-muted-foreground text-2xl mb-5 mt-4">{productDetails?.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className={`${productDetails?.saleprice > 0 ? "line-through" : ""} text-3xl font-bold text-primary`}>${productDetails?.price}</p>
                        {
                            productDetails?.saleprice > 0 ? <p className="text-2xl font-bold text-muted-foreground">${productDetails?.saleprice}</p> : null
                        }
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-0.5">
                            <StarRating rating={averageReview} />
                        </div>
                        <span className="text-muted-foreground">({averageReview.toFixed(2)})</span>
                    </div>
                    <div className="mt-5 mb-5">
                        {
                            productDetails?.totalstock === 0 ?
                                <Button className="w-full opacity-60 cursor-not-allowed">Out of Stock</Button> :
                                <Button onClick={() => handleAddtoCart(productDetails?._id, productDetails?.totalstock)} className="w-full">Add to Cart</Button>
                        }
                    </div>
                    <Separator />
                    <div className="max-h-[300px] overflow-auto">
                        <h2 className="text-xl font-bold mb-4">Reviews</h2>
                        <div className="grid gap-6">
                            {
                                reviews && reviews.length > 0 ?
                                    reviews.map((item) =>
                                        <div className="flex gap-4">
                                            <Avatar className="w-10 h-10 border">
                                                <AvatarFallback>{item?.username[0].toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="grid gap-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold">{item?.username}</h3>
                                                </div>
                                                <div className="flex items-center gap-0.5">
                                                    <StarRating rating={item?.reviewValue} />
                                                </div>
                                                <p className="text-muted-foreground">{item?.reviewMessage}</p>
                                            </div>
                                        </div>
                                    ) : <h1>No Reviews</h1>
                            }
                        </div>
                        <div className="mt-10 flex-col flex gap-2">
                            <Label>Write a review</Label>
                            <div className="flex gap-1 ">
                                <StarRating rating={rating} handleRatingChange={handleRatingChange} />
                            </div>
                            <Input name="reviewMsg" value={reviewMsg} onChange={(event) => setReviewMsg(event.target.value)} placeholder="Write a review..." />
                            <Button onClick={handleAddReview} disabled={reviewMsg.trim() === ""}>Submit</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProductDetailsDialog;