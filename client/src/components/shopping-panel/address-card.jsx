import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({ addressInfo, handleDeleteAddress, handleEditAddress, setCurrentSelectedAddress, selectedId }) {
    return (
        <Card className={`cursor-pointer border-red-500 ${selectedId?._id == addressInfo?._id ? "border-red-500 border-[3px]" : "border-black"}`} onClick={setCurrentSelectedAddress ? () => setCurrentSelectedAddress(addressInfo) : null}>
            <CardContent className="grid gap-4 p-4 ">
                <Label>Address: {addressInfo?.address}</Label>
                <Label>City: {addressInfo?.city}</Label>
                <Label>Pincode: {addressInfo?.pincode}</Label>
                <Label>Phone: {addressInfo?.phone}</Label>
                <Label>Notes: {addressInfo?.notes}</Label>
            </CardContent>
            <CardFooter className="flex justify-between p-3">
                <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
                <Button onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
            </CardFooter>
        </Card>
    )
}

export default AddressCard;