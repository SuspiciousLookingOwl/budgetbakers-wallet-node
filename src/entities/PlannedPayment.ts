import { PaymentType } from "../constants";
import { Account } from "./Account";
import { Document, DocumentProps } from "./Document";
import { HashTag } from "./HashTag";
import { RecordEntryType } from "./Record";

export type PlannedPaymentProps = DocumentProps & {
    generateFromDate: string;
    note: string;
    amount: number;
    reminder: number;
    dueDate: string;
    type: number;
    labels: string[];
    paymentType: number;
    threeDaysBeforeNotificationEnabled: boolean;
    accountId: string;
    dueDateNotificationEnabled: boolean;
    name: string;
    currencyId: string;
    categoryId: string;
    payee?: string;
    recurrenceRule?: string;
    manualPayment?: boolean;
    items?: PlannedPaymentItemProps[];
    reservedModelType: "StandingOrder";
};

type PlannedPaymentItemProps = {
    alignedDate: string;
    dismissed: boolean;
    id: number;
    originalDate: string;
    paidDate?: string;
    recordIds?: string[];
}

export type PlannedPaymentItem = {
    alignedDate: Date;
    dismissed: boolean;
    id: number;
    originalDate: Date;
}

export class PlannedPayment extends Document {
    public generateFromDate!: Date;
    public note!: string;
    public amount!: number;
    public reminder!: number;
    public dueDate!: Date;
    public type!: RecordEntryType;
    public labelIds!: string[];
    public paymentType!: PaymentType;
    public threeDaysBeforeNotificationEnabled!: boolean;
    public accountId!: string;
    public dueDateNotificationEnabled!: boolean;
    public name!: string;
    public currencyId!: string;
    public categoryId!: string;
    public recurrenceRule?: string;
    public payee?: string;
    public manualPayment?: boolean;
    public items?: PlannedPaymentItem[];
    public reservedModelType!: "StandingOrder";

    constructor(props: PlannedPaymentProps) {
        super(props);
        const { labels, generateFromDate, items, ...rest } = props;
        Object.assign(this, { ...rest });

        this.labelIds = labels;
        this.generateFromDate = new Date(generateFromDate);
        this.amount = props.amount / 100;
        this.items = items?.map((item) => ({
            ...item,
            alignedDate: new Date(item.alignedDate),
            originalDate: new Date(item.originalDate),
            paidDate: item.paidDate ? new Date(item.paidDate) : undefined,
        }));
    }

    public get account(): Account {
        return this.wallet.getAccount(this.accountId)!;
    }

    public get labels(): HashTag[] {
        return this.labelIds.map((id) => this.wallet.getHashTag(id)!);
    }

    public get currency() {
        return this.wallet.getCurrency(this.currencyId)!;
    }

    public get category() {
        return this.wallet.getCategory(this.categoryId)!;
    }

    // TODO parse recurrenceRule
}
