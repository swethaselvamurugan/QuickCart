import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accBanner from "../../assets/acc-banner.jpg";
import Address from "@/components/shopping-panel/address";
import ShopOrders from "@/components/shopping-panel/orders";

function ShoppingAccount() {
    return (
        <div className="flex flex-col">
            <div className="realtive h-[500px] w-full overflow-hidden">
                <img src={accBanner} className="h-full w-full object-cover object-center" />
            </div>
            <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
                <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
                    <Tabs defaultValue="orders">
                        <TabsList>
                            <TabsTrigger value="orders">Orders</TabsTrigger>
                            <TabsTrigger value="address">Address</TabsTrigger>
                        </TabsList>
                        <TabsContent value="orders"><ShopOrders /></TabsContent>
                        <TabsContent value="address"><Address /></TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default ShoppingAccount;