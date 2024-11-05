import { Currency } from "./Currency";
import { Document, DocumentProps } from "./Document";

export type AccountProps = DocumentProps & {
	color: string;
	accountType: number;
	gps: boolean;
	reservedOwnerId: string;
	archived: boolean;
	excludeFromStats: boolean;
	name: string;
	position: number;
	currencyId: string;
	initAmount: number;
	locked: boolean;
	initRefAmount: number;
	reservedModelType: "Account";
	creditCard?: {
		limit: number;
		dueDay: number;
		balanceDisplayOption: number;
	};
};

export enum AccountType {
	GENERAL = 0,
	CASH = 1,
	CURRENT_ACCOUNT = 2,
	CREDIT_CARD = 3,
	SAVING_ACCOUNT = 4,
	BONUS = 5,
	INSURANCE = 6,
	INVESTMENT = 7,
	LOAN = 8,
	MORTGAGE = 9,
	ACCOUNT_WITH_OVERDRAFT = 10,
}

export class Account extends Document {
	public color!: string;
	public accountType!: AccountType;
	public gps!: boolean;
	public archived!: boolean;
	public excludeFromStats!: boolean;
	public name!: string;
	public position!: number;
	public currencyId!: string;
	public initAmount!: number;
	public locked!: boolean;
	public initRefAmount!: number;
	public reservedModelType = "Account" as const;

	constructor(props: AccountProps) {
		super(props);
		Object.assign(this, { ...props });
		this.initAmount = this.initAmount / 100;
		this.initRefAmount = this.initRefAmount / 100;
	}

	get currency(): Currency {
		return this.wallet.getCurrency(this.currencyId)!;
	}
}
