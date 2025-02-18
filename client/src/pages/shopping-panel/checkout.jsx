import Address from "@/components/shopping-panel/address";
import checkoutBanner from "../../assets/checkout-banner.jpg";
import { useDispatch, useSelector } from "react-redux";
import USerCartItemsContent from "@/components/shopping-panel/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/hooks/use-toast";


function ShoppingCheckout() {

    const { cartItems } = useSelector(state => state.shopCart);
    const { user } = useSelector(state => state.auth);
    const { approvalURL } = useSelector(state => state.shopOrder);
    const dispatch = useDispatch();
    const { toast } = useToast();
    const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
    const [isPaymentStart, setIsPaymentStart] = useState(false);
    const totalCartAmount = cartItems && cartItems.items && cartItems.items.length > 0 ? cartItems.items.reduce((sum, currentItem) => sum + (currentItem?.saleprice > 0 ? currentItem?.saleprice : currentItem?.price) * currentItem?.quantity, 0) : null;

    function handleInitiatePaypalPayment() {
        if (currentSelectedAddress === null) {
            toast({ title: "Please select one address to proceed.", variant: "destructive" });
            return;
        }
        if (cartItems.length === 0) {
            toast({ title: "Your is empty, Please add items to proceed.", variant: "destructive" });
            return;
        }
        const orderData = {
            userId: user?.id,
            cartId: cartItems?._id,
            cartItems: cartItems.items.map((item) =>
            ({
                productId: item?.productId,
                title: item?.title,
                image: item?.image,
                price: item?.saleprice > 0 ? item?.saleprice : item?.price,
                quantity: item?.quantity
            }
            )),
            addressInfo: {
                addressId: currentSelectedAddress?._id,
                address: currentSelectedAddress?.address,
                city: currentSelectedAddress?.city,
                pincode: currentSelectedAddress?.pincode,
                phone: currentSelectedAddress?.phone,
                notes: currentSelectedAddress?.notes
            },
            orderStatus: "pending",
            paymentMethod: "paypal",
            paymentStatus: "pending",
            totalAmount: totalCartAmount,
            orderDate: new Date(),
            orderUpdateDate: new Date(),
            paymentId: "",
            payerId: ""
        }
        console.log(orderData, "Order Data");
        dispatch(createNewOrder(orderData))
            .then((data) => {
                console.log(data, "Initiated payment result:");
                if (data?.payload?.success) {
                    setIsPaymentStart(true)
                } else {
                    setIsPaymentStart(false);
                }
            })
    }

    if (approvalURL) {
        window.location.href = approvalURL;
    }

    return (
        <div className="flex flex-col">
            <div className="relative h-[500px] w-full overflow-hidden">
                <img src={checkoutBanner} className="h-full w-full object-cover object-center" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
                <Address selectedId={currentSelectedAddress} setCurrentSelectedAddress={setCurrentSelectedAddress} />
                <div className="flex flex-col gap-4">
                    {
                        cartItems && cartItems.items && cartItems.items.length > 0 ?
                            cartItems.items.map((item) => <USerCartItemsContent cartItem={item} />) : null
                    }
                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between">
                            <span className="font-bold">Total</span>
                            <span className="font-bold">${totalCartAmount}</span>
                        </div>
                    </div>
                    <div className="mt-4 w-full">
                        <Button onClick={handleInitiatePaypalPayment} className="w-full">{isPaymentStart ? "Processing Paypal Payment..." : "Checkout with Paypal"}</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShoppingCheckout;