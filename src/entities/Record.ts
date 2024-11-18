import { PaymentType } from "../constants";
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
	photos: PhotoProps[];
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
	refObjects: RefObject[];
	categoryId: string;
	payee?: string;
	reservedModelType: "Record";
};

type RefObject = {
	id: string;
	type: number;
}

type PhotoProps = {
	backedInCloud: boolean;
	cratedAt: string;
	url: string;
};

type Photo = {
	backedInCloud: boolean;
	createdAt: Date;
	url: string;
};

export enum RecordEntryType {
	INCOME = 0,
	EXPENSE = 1,
}

export class RecordEntry extends Document {
	public note!: string;
	public latitude!: number;
	public accuracy!: number;
	public type!: RecordEntryType;
	public photos!: Photo[];
	public paymentType!: PaymentType;
	public warrantyInMonth!: number;
	public recordDate!: Date;
	public currencyId!: string;
	public recordState!: number;
	public longitude!: number;
	public refAmount!: number;
	public amount!: number;
	public suggestedEnvelopeId!: number;
	public labelIds!: string[];
	public accountId!: string;
	public transfer!: boolean;
	public transferAccountId?: string;
	public categoryChanged!: boolean;
	public categoryConfirmReason!: number;
	public refObjects!: RefObject[];
	public categoryId!: string;
	public payee?: string;
	public reservedModelType = "Record" as const;

	constructor(props: RecordProps) {
		super(props);
		const { labels, recordDate, photos, ...rest } = props;
		Object.assign(this, { ...rest });

		this.labelIds = labels;
		this.amount = this.amount / 100;
		this.refAmount = this.refAmount / 100;
		this.recordDate = new Date(recordDate);
		this.photos = photos.map((photo) => ({
			...photo,
			createdAt: new Date(photo.cratedAt),
		}));
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

	public get labels(): HashTag[] {
		return this.labelIds.map((id) => this.wallet.getHashTag(id)!);
	}

	public amountInCurrency(currency: Currency | string): number {
		currency = typeof currency === "string" ? this.wallet.getCurrency(currency)! : currency;

		const amountInReferentialCurrency = this.amount * this.currency.ratioToReferential;
		return amountInReferentialCurrency / currency.ratioToReferential;
	}
}
