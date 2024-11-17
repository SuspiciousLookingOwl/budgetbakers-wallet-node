import { Document, DocumentProps } from "./Document";
import { HashTag } from "./HashTag";

export type PlanneDPaymentProps = DocumentProps & {
    generateFromDate: string;
    note: string;
    amount: number;
    reminder: number;
    dueDate: string;
    reservedUpdatedAt: string;
    type: number;
    labels: string[];
    paymentType: number;
    threeDaysBeforeNotificationEnabled: boolean;
    accountId: string;
    reservedSource: string;
    dueDateNotificationEnabled: boolean;
    name: string;
    currencyId: string;
    categoryId: string;
    reservedModelType: "StandingOrder";
};


export class PlannedPayment extends Document {
    public note!: string;
    public amount!: number;
    public type!: number;
    public labelIds!: string[];
    public paymentType!: number;
    public accountId!: string;
    public name!: string;
    public position!: number;
    public currencyId!: string;
    public categoryId!: string;
    public reservedModelType = "Template" as const;

    constructor(props: TemplateProps) {
        super(props);
        const { labels, ...rest } = props;
        Object.assign(this, { ...rest });

        this.labelIds = labels;
        this.amount = props.amount / 100;
    }

    public get labels(): HashTag[] {
        return this.labelIds.map((id) => this.wallet.getHashTag(id)!);
    }
}
