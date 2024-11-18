import { PaymentType } from "../constants";
import { Document, DocumentProps } from "./Document";
import { Label } from "./Label";
import { RecordEntryType } from "./Record";

export type TemplateProps = DocumentProps & {
	note: string;
	amount: number;
	type: number;
	labels: string[];
	paymentType: number;
	accountId: string;
	name: string;
	position: number;
	currencyId: string;
	categoryId: string;
	payee?: string;
	reservedModelType: "Template";
};

export class Template extends Document {
	public note!: string;
	public amount!: number;
	public type!: RecordEntryType;
	public labelIds!: string[];
	public paymentType!: PaymentType;
	public accountId!: string;
	public name!: string;
	public position!: number;
	public currencyId!: string;
	public categoryId!: string;
	public payee?: string;
	public reservedModelType = "Template" as const;

	constructor(props: TemplateProps) {
		super(props);
		const { labels, ...rest } = props;
		Object.assign(this, { ...rest });

		this.labelIds = labels;
		this.amount = props.amount / 100;
	}

	public get labels(): Label[] {
		return this.labelIds.map((id) => this.wallet.getLabel(id)!);
	}
}
