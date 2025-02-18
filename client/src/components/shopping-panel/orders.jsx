import { Dialog } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import ShopOrderDetails from "./order-details";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails } from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";
import { use } from "react";

function ShopOrders() {

    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const { user } = useSelector(state => state.auth);
    const { orderList, orderDetails } = useSelector(state => state.shopOrder);
    const dispatch = useDispatch();

    function handleFetchOrderDetails(getId) {
        dispatch(getOrderDetails(getId))
    }

    useEffect(() => {
        dispatch(getAllOrdersByUserId(user?.id))
    }, [dispatch])

    useEffect(() => {
        if (orderDetails !== null) setOpenDetailsDialog(true);
    }, [orderDetails])

    console.log(orderList, orderDetails, "Order List and Details")

    return (
        <Card>
            <CardHeader><CardTitle>Order History</CardTitle></CardHeader>
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
                                            <Dialog open={openDetailsDialog} onOpenChange={() => { setOpenDetailsDialog(false); dispatch(resetOrderDetails) }}>
                                                <Button onClick={() => handleFetchOrderDetails(item?._id)}>View Details</Button>
                                                <ShopOrderDetails orderDetails={orderDetails} />
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

export default ShopOrders;