import { Currency } from "./Currency";
import { Document, DocumentProps } from "./Document";

type AccountProps = DocumentProps & {
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
};

export class Account extends Document implements AccountProps {
	public color!: string;
	public accountType!: number;
	public gps!: boolean;
	public reservedOwnerId!: string;
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
	}

	get currency(): Currency {
		return this.wallet.getCurrency(this.currencyId)!;
	}
}
