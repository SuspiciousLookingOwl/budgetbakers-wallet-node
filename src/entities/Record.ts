import { Account } from "./Account";
import { Category } from "./Category";
import { Currency } from "./Currency";
import { Document, DocumentProps } from "./Document";
import { HashTag } from "./HashTag";

export type RecordProps = DocumentProps & {
	note: string;
	latitude: number;
	accuracy: number;
	type: number;
	photos: Photo[];
	paymentType: number;
	warrantyInMonth: number;
	recordDate: string;
	currencyId: string;
	recordState: number;
	longitude: number;
	refAmount: number;
	amount: number;
	suggestedEnvelopeId: number;
	labels: string[];
	accountId: string;
	transfer: boolean;
	transferAccountId?: string;
	categoryChanged: boolean;
	categoryConfirmReason: number;
	refObjects: unknown[];
	categoryId: string;
	reservedModelType: "Record";
};

type Photo = {
	backedInCloud: boolean;
	cratedAt: string;
	url: string;
};

export class Record extends Document implements RecordProps {
	public note!: string;
	public latitude!: number;
	public accuracy!: number;
	public type!: number;
	public photos!: Photo[];
	public paymentType!: number;
	public warrantyInMonth!: number;
	public recordDate!: string;
	public currencyId!: string;
	public recordState!: number;
	public longitude!: number;
	public refAmount!: number;
	public amount!: number;
	public suggestedEnvelopeId!: number;
	public labels!: string[];
	public accountId!: string;
	public transfer!: boolean;
	public transferAccountId?: string;
	public categoryChanged!: boolean;
	public categoryConfirmReason!: number;
	public refObjects!: unknown[];
	public categoryId!: string;
	public reservedModelType = "Record" as const;

	constructor(props: RecordProps) {
		super(props);
		Object.assign(this, { ...props });
	}

	public get account(): Account {
		return this.wallet.getAccount(this.accountId)!;
	}

	public get transferAccount(): Account | null {
		return this.transferAccountId ? this.wallet.getAccount(this.transferAccountId) : null;
	}

	public get currency(): Currency {
		return this.wallet.getCurrency(this.currencyId)!;
	}

	public get category(): Category {
		return this.wallet.getCategory(this.categoryId)!;
	}

	public get hashtags(): HashTag[] {
		return this.labels.map((label) => this.wallet.getHashTag(label)!);
	}

	public amountInCurrency(currency: Currency | string): number {
		currency = typeof currency === "string" ? this.wallet.getCurrency(currency)! : currency;

		const amountInReferentialCurrency = this.amount * this.currency.ratioToReferential;
		return amountInReferentialCurrency / currency.ratioToReferential;
	}
}
