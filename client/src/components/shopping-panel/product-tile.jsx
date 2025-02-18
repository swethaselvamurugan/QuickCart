import { categoryOptionsMap, brandOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function ShoppingProductTile({ product, handleGetProductDetails, handleAddtoCart }) {
    return (
        <Card className="w-full max-w-sm mx-auto">
            <div onClick={() => handleGetProductDetails(product?._id)}>
                <div className="relative">
                    <img src={product?.image} alt={product?.title} className="w-full h-[300px] object-cover rounded-t-lg" />
                    {
                        product?.totalstock === 0 ? <Badge className="absolute top-1 left-2 bg-red-500 hover:bg-red-600">Out of Stock</Badge> :
                            product?.totalstock < 10 ? <Badge className="absolute top-1 left-2 bg-red-500 hover:bg-red-600">{`Only ${product?.totalstock} items left`}</Badge> :
                                product?.saleprice > 0 ? <Badge className="absolute top-1 left-2 bg-red-500 hover:bg-red-600">Sale</Badge> : null
                    }
                </div>
                <CardContent className="p-4">
                    <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
                    <div className="flex mb-2 justify-between items-center">
                        <span className="text-[16px] text-muted-foreground">{categoryOptionsMap[product?.category]}</span>
                        <span className="text-[16px] text-muted-foreground">{brandOptionsMap[product?.brand]}</span>
                    </div>
                    <div className="flex mb-2 justify-between items-center">
                        <span className={`${product?.saleprice > 0 ? "line-through" : ""} text-lg font-semibold text-primary`}>${product?.price}</span>
                        {
                            product?.saleprice > 0 ? <span className="text-lg font-semibold text-primary">${product?.saleprice}</span> : null
                        }
                    </div>
                </CardContent>
            </div>
            <CardFooter>
                {
                    product?.totalstock === 0 ?
                        <Button className="w-full opacity-60 cursor-not-allowed">Out of Stock</Button> :
                        <Button onClick={() => handleAddtoCart(product?._id, product?.totalstock)} className="w-full">Add to Cart</Button>
                }
            </CardFooter>
        </Card>
    )
}

export default ShoppingProductTile;