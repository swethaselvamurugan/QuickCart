import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";
import { useState } from "react";

function AdminLayout() {

    const[openSidebar, setOpenSidebar] = useState(false);

    return (
        <div className="flex min-h-screen w-full">
            {/* Admin sidebar */}
            <AdminSideBar open={openSidebar} setOpen={setOpenSidebar}></AdminSideBar>
            <div className="flex flex-1 flex-col">
                {/* Admin header */}
                <AdminHeader open={openSidebar} setOpen={setOpenSidebar}></AdminHeader>
                <main className="flex flex-col flex-1 bg-muted/40 p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout;