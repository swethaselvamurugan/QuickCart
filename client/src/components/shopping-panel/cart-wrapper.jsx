import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import USerCartItemsContent from "./cart-items-content";


function USerCartWrapper({ cartItems, setOpenCartSheet, setOpenMenuSheet }) {

    const navigate = useNavigate();
    const totalCartAmount = cartItems && cartItems.length > 0 ? cartItems.reduce((sum, currentItem) => sum + (currentItem?.saleprice > 0 ? currentItem?.saleprice : currentItem?.price) * currentItem?.quantity, 0) : null

    return (
        <SheetContent className="sm:max-w-md">
            <SheetHeader><SheetTitle>Your cart</SheetTitle></SheetHeader>
            <div className="mt-8 space-y-4">
                {
                    cartItems && cartItems.length > 0 ?
                        cartItems.map((item) => <USerCartItemsContent cartItem={item} />) : null
                }
            </div>
            <div className="mt-8 space-y-4">
                <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">${totalCartAmount}</span>
                </div>
            </div>
            <Button onClick={() => { navigate("/shop/checkout"); setOpenCartSheet(false); setOpenMenuSheet(false) }} className="w-full mt-6">Checkout</Button>
        </SheetContent>
    )
}

export default USerCartWrapper;