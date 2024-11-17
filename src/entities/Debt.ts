import { Account } from "./Account";
import { Document, DocumentProps } from "./Document";
import { RecordEntry } from "./Record";

export type DebtProps = DocumentProps & {
    date: string;
    note: string;
    amount: number;
    useDebtAmount: boolean;
    payBackTime: string;
    forgiven: boolean;
    type: number;
    accountId: string;
    remainingAmount: number;
    name: string;
    paidBack: boolean;
    reservedModelType: "Debt";
};

export enum DebtType {
    LENT = 0,
    BORROWED = 1,
}

export class Debt extends Document {
    public date!: Date;
    public note!: string;
    public amount!: number;
    public useDebtAmount!: boolean;
    public payBackTime!: Date;
    public forgiven!: boolean;
    public type!: DebtType;
    public accountId!: string;
    public remainingAmount!: number;
    public name!: string;
    public paidBack!: boolean;
    public reservedModelType = "Debt" as const;

    constructor(props: DebtProps) {
        super(props);
        const { date, payBackTime, ...rest } = props;
        Object.assign(this, { ...rest });

        this.date = new Date(date);
        this.payBackTime = new Date(payBackTime);
        this.amount = props.amount / 100;
        this.remainingAmount = props.remainingAmount / 100;
    }

    public get account(): Account {
        return this.wallet.getAccount(this.accountId)!;
    }

    public get records(): RecordEntry[] {
        return this.wallet.records.filter(r => r.refObjects.some(({ id }) => id === this._id));
    }
}