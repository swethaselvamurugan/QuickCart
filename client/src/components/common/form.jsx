import { SelectContent, SelectTrigger } from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "@/components/ui/button"; 
import { SelectItem } from "../ui/select";

function CommonForm({ formControls, formData, setFormData, onSubmit, buttonText, isFormValid }) {

    function renderInputsByComponentType(item) {
        let element = null;
        const value = formData[item.name] || "";
        switch (item.componentType) {
            case "input":
                element = <Input
                    name={item.name}
                    placeholder={item.placeholder}
                    id={item.name}
                    type={item.type}
                    value={value}
                    onChange= {
                        (event) => setFormData({...formData, [item.name]: event.target.value})
                    }
                />
                break;
            case "select":
                element = <Select value={value} onValueChange={(value) => setFormData({...formData, [item.name]: value})}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={item.placeholder}></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {
                            item.options &&
                                item.options.length > 0 ?
                                item.options.map((item) => <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>) : null
                        }
                    </SelectContent>
                </Select>
                break;
            case "textarea":
                element = <Textarea
                    name={item.name}
                    placeholder={item.placeholder}
                    id={item.name}
                    type={item.type}
                    value={value}
                    onChange= {
                        (event) => setFormData({...formData, [item.name]: event.target.value})
                    }
                />
                break;
            default:
                element = <Input
                    name={item.name}
                    placeholder={item.placeholder}
                    id={item.name}
                    type={item.type}
                    value={value}
                    onChange= {
                        (event) => setFormData({...formData, [item.name]: event.target.value})
                    }
                />
                break;
        }
        return element
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-3">
                {
                    formControls.map((item) =>
                        <div className="grid w-full gap-1.5" key={item.name}>
                            <Label className="mb-1">{item.label}</Label>
                            {
                                renderInputsByComponentType(item)
                            }
                        </div>)
                }
            </div>
            <Button disabled={isFormValid} type="submit" className="mt-2 w-full">{buttonText || "Submit"}</Button>
        </form>
    )
}

export default CommonForm;