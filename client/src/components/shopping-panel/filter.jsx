import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filter, handleFilter }) {
    return (
        <div className="bg-background rounded-lg shadow-sm">
            <div className="p-4 border-b">
                <h2 className="text-lg font-extrabold">Filters</h2>
            </div>
            <div className="p-4 space-y-4">
                {
                    Object.keys(filterOptions).map((item) => <Fragment>
                        <div>
                            <h3 className="text-base font-bold">{item}</h3>
                            <div className="grid gap-2 mt-2">
                                {
                                    filterOptions[item].map((option) => <Label className="flex items-center gap-2 font-medium">
                                        <Checkbox checked={filter && Object.keys(filter).length > 0 && filter[item] && filter[item].indexOf(option.id) > -1} onCheckedChange={() => handleFilter(item, option.id)} /> {option.label}
                                    </Label>)
                                }
                            </div>
                        </div>
                        <Separator />
                    </Fragment>)
                }
            </div>
        </div>
    )
}

export default ProductFilter;