import {Measurement, Checkbox, Currency, Option} from './AttributeType';
import AttributeType from "@/models/AttributeType";

export default interface Attribute {
    id?: string | undefined | null;
    type: AttributeType;
    value: Measurement | Checkbox | number | string | Date | undefined | null | Currency | Option;
    edit: boolean;
    label: string;
}