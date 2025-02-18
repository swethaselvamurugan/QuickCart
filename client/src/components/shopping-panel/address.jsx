import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { addNewAddress, deleteAddress, editAddress, fetchAllAddress } from "@/store/shop/address-slice";
import AddressCard from "./address-card";

const initialAddressFormData = {
    address: "",
    city: "",
    pincode: "",
    phone: "",
    notes: ""
};

function Address({setCurrentSelectedAddress, selectedId}) {

    const [formData, setFormData] = useState(initialAddressFormData);
    const { user } = useSelector(state => state.auth);
    const { addressList } = useSelector(state => state.shopAddress);
    const [currentEditedId, setCurrentEditedId] = useState(null);
    const dispatch = useDispatch();
    const { toast } = useToast();

    function handleManageAddress(event) {
        event.preventDefault();
        if (addressList.length >= 3 && currentEditedId === null ) {
            toast({ title: "You can add max 3 address.", variant: "destructive" });
            setFormData(initialAddressFormData);
            return;
        }
        currentEditedId !== null ?
            dispatch(editAddress({ userId: user?.id, addressId: currentEditedId, formData }))
                .then((data) => {
                    console.log(data);
                    if (data?.payload?.success) {
                        dispatch(fetchAllAddress(user?.id));
                        setCurrentEditedId(null);
                        setFormData(initialAddressFormData);
                        toast({ title: "Address updated successfully." });
                    }
                }) :
            dispatch(addNewAddress({ ...formData, userId: user?.id }))
                .then((data) => {
                    console.log(data);
                    if (data?.payload?.success) {
                        dispatch(fetchAllAddress(user?.id));
                        setFormData(initialAddressFormData);
                        toast({ title: "Address added successfully." });
                    }
                })
    }

    function handleDeleteAddress(getCurrentAddress) {
        dispatch(deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id }))
            .then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchAllAddress(user?.id));
                    toast({ title: "Address deleted successfully." });
                }
            })
    }

    function handleEditAddress(getCurrentAddress) {
        setCurrentEditedId(getCurrentAddress?._id);
        setFormData({
            ...formData,
            address: getCurrentAddress?.address,
            city: getCurrentAddress?.city,
            pincode: getCurrentAddress?.pincode,
            phone: getCurrentAddress?.phone,
            notes: getCurrentAddress?.notes
        })
    }

    function isFormValid() {
        return Object.keys(formData).map((key) => formData[key].trim() !== "").every((item) => item);
    }

    useEffect(() => {
        dispatch(fetchAllAddress(user?.id))
    }, [dispatch]);

    console.log(addressList, "Address List")

    return (
        <Card>
            <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {
                    addressList && addressList.length > 0 ?
                        addressList.map((item) => <AddressCard selectedId={selectedId} handleDeleteAddress={handleDeleteAddress} handleEditAddress={handleEditAddress} addressInfo={item} setCurrentSelectedAddress={setCurrentSelectedAddress} />) : null
                }
            </div>
            <CardHeader><CardTitle>{currentEditedId !== null ? "Edit Address" : "Add New Address"}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
                <CommonForm formControls={addressFormControls} formData={formData} setFormData={setFormData} buttonText={currentEditedId !== null ? "Edit" : "Add"} onSubmit={handleManageAddress} isFormValid={!isFormValid()} />
            </CardContent>
        </Card>
    )
}

export default Address;