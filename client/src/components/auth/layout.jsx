import { Outlet } from "react-router-dom";
import quickcart from "../../assets/quickcart-logo.svg"

function AuthLayout() {
    return (
        <div className="flex min-h-screen w-full">
            <div className="hidden lg:flex items-center justify-center bg-[#0f121b] w-1/2 px-12">
                <svg width="700" height="700" viewBox="0 0 700 700" xmlns="http://www.w3.org/2000/svg">
                    <image href={quickcart} width="700" height="700" />
                </svg>
            </div>
            <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
                <Outlet />
            </div>
        </div>
    )
}

export default AuthLayout;