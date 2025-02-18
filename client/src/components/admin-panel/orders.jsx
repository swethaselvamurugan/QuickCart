import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import AdminOrderDetails from "./order-details";
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, resetOrderDetails } from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";

function AdminOrdersView() {

    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const { orderList, orderDetails } = useSelector(state => state.adminOrder);
    const dispatch = useDispatch();

    function handleFetchOrderDetails(getId) {
        dispatch(getOrderDetailsForAdmin(getId))
    }

    useEffect(() => {
        dispatch(getAllOrdersForAdmin())
    }, [dispatch])

    useEffect(() => {
        if (orderDetails !== null) setOpenDetailsDialog(true);
    }, [orderDetails])

    console.log(orderList, orderDetails, "Order List and Details")

    return (
        <Card>
            <CardHeader><CardTitle>All Orders</CardTitle></CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Order Status</TableHead>
                            <TableHead>Order Price</TableHead>
                            <TableHead><span className="sr-only">Details</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            orderList && orderList.length > 0 ?
                                orderList.map((item) =>
                                    <TableRow>
                                        <TableCell>{item?._id}</TableCell>
                                        <TableCell>{item?.orderDate.split("T")[0]}</TableCell>
                                        <TableCell><Badge className={`${item?.orderStatus === "confirmed" ? "bg-green-500" : item?.orderStatus === "rejected" ? "bg-red-500" : "bg-black"} pxy-1 px-3`}>{item?.orderStatus}</Badge></TableCell>
                                        <TableCell>${item?.totalAmount}</TableCell>
                                        <TableCell>
                                            <Dialog open={openDetailsDialog} onOpenChange={() => { setOpenDetailsDialog(false); dispatch(resetOrderDetails()); }}>
                                                <Button onClick={() => handleFetchOrderDetails(item?._id)}>View Details</Button>
                                                <AdminOrderDetails orderDetails={orderDetails} />
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>) : null
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default AdminOrdersView;