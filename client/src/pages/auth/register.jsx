import CommonForm from "@/components/common/form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerFormControls } from "@/config";
import { useDispatch } from "react-redux";
import { registerUser } from "@/store/auth-slice";
import { useToast } from "@/hooks/use-toast";

const initialState = {
    username: "",
    email: "",
    password: "",
}

function AuthRegister() {

    const [formData, setFormData] = useState(initialState)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { toast } = useToast()

    function onSubmit(event) {
        event.preventDefault();
        dispatch(registerUser(formData))
            .then((data) => {
                if (data?.payload?.success) { toast({ title: data?.payload?.message }); navigate("/auth/login") }
                else { toast({ title: data?.payload?.message, variant: "destructive" }) }
            })
        console.log(formData)
    }

    return (
        <div className="mx-auto w-full mx-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Create new account</h1>
                <p className="mt-2">Already have an account?<Link className="font-medium text-primary hover:underline ml-2" to="/auth/login">login</Link></p>
            </div>
            <CommonForm
                formControls={registerFormControls}
                buttonText={"Sign Up"}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}>
            </CommonForm>
        </div>
    )
}

export default AuthRegister;