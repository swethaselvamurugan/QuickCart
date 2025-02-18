import { Button } from "@/components/ui/button";
import { Fragment, useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import CommonForm from "@/components/common/form";
import { addProductFormElements } from "@/config";
import ProductImageUpload from "@/components/admin-panel/image-upload";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, deleteProduct, editProduct, fetchAllProducts } from "@/store/admin/products-slice";
import { useToast } from "@/hooks/use-toast";
import AdminProductTile from "@/components/admin-panel/product-tile";

const initialFormData = {
    image: null,
    title: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    saleprice: "",
    totalstock: ""
}

function AdminProducts() {

    const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const [currentProductID, setCurrentProductID] = useState(null);
    const { productList } = useSelector(state => state.adminProducts)
    const dispatch = useDispatch();
    const { toast } = useToast();

    useEffect(() => {
        dispatch(fetchAllProducts())
    }, [dispatch])

    function onSubmit(event) {
        event.preventDefault();
        currentProductID !== null ?
            dispatch(editProduct({ id: currentProductID, formData })).then((data) => {
                console.log("Edited Product", data);
                if (data?.payload?.success) {
                    dispatch(fetchAllProducts());
                    setFormData(initialFormData);
                    setCurrentProductID(null);
                    setOpenCreateProductsDialog(false);
                    toast({
                        title: "Product edited successfully."
                    })
                }
            }) :
            dispatch(addProduct({
                ...formData,
                image: uploadedImageUrl
            })).then((data) => {
                console.log("Added Product", data);
                if (data?.payload?.success) {
                    dispatch(fetchAllProducts());
                    setImageFile(null);
                    setFormData(initialFormData);
                    setOpenCreateProductsDialog(false);
                    toast({
                        title: "Product added successfully."
                    })
                }
            })
    }

    function handleDelete(getDeleteProductID) {
        console.log(getDeleteProductID);
        dispatch(deleteProduct(getDeleteProductID)).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllProducts())
            }
        })
    }

    function isFormValid() {
        return Object.keys(formData).map(key => formData[key] !== '').every(item => item);
    }

    console.log(formData, "productList")

    return (
        <Fragment>
            <div className="mb-5 w-full flex justify-end">
                <Button onClick={() => setOpenCreateProductsDialog(true)}>Add New Product</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {
                    productList && productList.length > 0 ?
                        productList.map((item) => <AdminProductTile product={item} setOpenCreateProductsDialog={setOpenCreateProductsDialog} setFormData={setFormData} setCurrentProductID={setCurrentProductID} handleDelete={handleDelete} />) : null
                }
            </div>
            <Sheet open={openCreateProductsDialog} onOpenChange={() => { setOpenCreateProductsDialog(false); setCurrentProductID(null); setFormData(initialFormData) }}>
                <SheetContent side="right" className="overflow-auto">
                    <SheetHeader>
                        <SheetTitle>{currentProductID !== null ? "Edit Product" : "Add New Product"}</SheetTitle>
                    </SheetHeader>
                    <ProductImageUpload imageFile={imageFile} setImageFile={setImageFile} uploadedImageUrl={uploadedImageUrl} setUploadedImageUrl={setUploadedImageUrl} imageLoadingState={imageLoadingState} setImageLoadingState={setImageLoadingState} isEditMode={currentProductID !== null} />
                    <div className="py-6">
                        <CommonForm onSubmit={onSubmit} formData={formData} setFormData={setFormData} buttonText={currentProductID !== null ? "Edit" : "Add"} formControls={addProductFormElements} isFormValid={!isFormValid()} />
                    </div>
                </SheetContent>
            </Sheet>
        </Fragment>
    )
}

export default AdminProducts;