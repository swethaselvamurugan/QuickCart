import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { House, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingPanelHeaderMenuItems } from "@/config";
import { Menu } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ShoppingCart } from "lucide-react";
import { User } from "lucide-react";
import { logoutUser, resetTokenAndCredentials } from "@/store/auth-slice";
import USerCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import quickcart from "../../assets/quickcart-logo.svg";

function MenuItems({ setOpenMenuSheet }) {

    const navigate = useNavigate();
    const location = useLocation();
    const [seachParams, setSearchParams] = useSearchParams();

    function handleNavigateToListingPage(getCurrentMenuItem) {
        sessionStorage.removeItem("Filter");
        const currentFilter = getCurrentMenuItem.id !== "home" && getCurrentMenuItem.id !== "products" && getCurrentMenuItem.id !== "search" ? { category: [getCurrentMenuItem.id] } : null
        sessionStorage.setItem("Filter", JSON.stringify(currentFilter));
        location.pathname.includes("listing") && currentFilter !== null ?
            setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`)) :
            navigate(getCurrentMenuItem.path);
        setOpenMenuSheet(false)
    }

    return <nav className="flex flex-col mb-3 lg:mb-0 lg: items-center gap-6 lg:flex-row">
        {
            shoppingPanelHeaderMenuItems.map((item) => <Label onClick={() => handleNavigateToListingPage(item)} className="text-md font-medium cursor-pointer" key={item.id}>{item.label}</Label>)
        }
    </nav>
}

function HeaderRightContent({ setOpenMenuSheet }) {

    const { user } = useSelector(state => state.auth);
    const { cartItems } = useSelector(state => state.shopCart);
    const [openCartSheet, setOpenCartSheet] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    console.log("User", user);

    function handleLogout() {
        // dispatch(logoutUser());
        dispatch(resetTokenAndCredentials());
        sessionStorage.clear();
        navigate("/auth/login");
    }

    useEffect(() => {
        dispatch(fetchCartItems(user?.id))
    }, [dispatch])

    console.log(cartItems, "Cart Items:")

    return <div className="flex items-center justify-center gap-4 lg:items-center lg:flex-row">
        <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
            <Button onClick={() => setOpenCartSheet(true)} variant="outline" size="icon" className="relative"><ShoppingCart className="h-6 w-6" /><span className="absolute top-[-2px] right-[3px] font-bold text-sm">{cartItems?.items?.length || 0}</span><span className="sr-only">User Cart</span></Button>
            <USerCartWrapper setOpenCartSheet={setOpenCartSheet} setOpenMenuSheet={setOpenMenuSheet} cartItems={cartItems && cartItems.items && cartItems.items.length > 0 ? cartItems.items : []} />
        </Sheet>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="bg-[#0F121B]"><AvatarFallback className="bg-[#0F121B] text-white font-extrabold">{user?.username[0].toUpperCase()}</AvatarFallback></Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" className="w-56">
                <DropdownMenuLabel>Logged in as {user?.username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { navigate("/shop/account"); setOpenMenuSheet(false) }}><User className="mr-2 w-4 h-4" />Account</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 w-4 h-4" />Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
}

function ShoppingHeader() {

    const { isAuthenticated } = useSelector(state => state.auth);
    const [openMenuSheet, setOpenMenuSheet] = useState(false);

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                <Link to="/shop/home" >
                    <svg width="150" height="150" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <image href={quickcart} width="100" height="100" />
                    </svg>
                </Link>
                <Sheet open={openMenuSheet} onOpenChange={() => setOpenMenuSheet(false)}>
                    <Button onClick={() => setOpenMenuSheet(true)} variant="outline" size="icon" className="lg:hidden"><Menu className="h-6 w-6" /><span className="sr-only">Toggle Header Menu</span></Button>
                    <SheetContent side="left" className="w-full max-w-xs"><MenuItems setOpenMenuSheet={setOpenMenuSheet} /><HeaderRightContent setOpenMenuSheet={setOpenMenuSheet} /></SheetContent>
                </Sheet>
                <div className="hidden lg:block"><MenuItems /></div>
                {isAuthenticated ? <div className="hidden lg:block"><HeaderRightContent /></div> : null}
            </div>
        </header>
    )
}

export default ShoppingHeader;