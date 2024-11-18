import { Document, DocumentProps } from "./Document";

export type ShoppingListProps = DocumentProps & {
    reminder?: string;
    name: string;
    position: number;
    items: ShoppingListItem[];
    reservedModelType: "ShoppingList";
};

export interface ShoppingListItem {
    amount: number;
    checked: boolean;
    name: string;
    position: number;
}

export class ShoppingList extends Document {
    public reminder?: Date;
    public name!: string;
    public position!: number;
    public items!: ShoppingListItem[];
    public reservedModelType = "ShoppingList" as const;

    constructor(props: ShoppingListProps) {
        super(props);
        const { reminder, ...rest } = props;
        Object.assign(this, { ...rest });

        this.reminder = reminder ? new Date(reminder) : undefined;
    }
}
