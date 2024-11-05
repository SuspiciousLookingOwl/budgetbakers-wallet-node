import { Document, DocumentProps } from "./Document";

export type CurrencyProps = DocumentProps & {
	code: string;
	ratioToReferential: number;
	reservedAuthorId: string;
	referential: boolean;
	position: number;
	reservedModelType: "Currency";
};

export class Currency extends Document {
	public code!: string;
	public ratioToReferential!: number;
	public referential!: boolean;
	public position!: number;
	public reservedModelType = "Currency" as const;

	constructor(props: CurrencyProps) {
		super(props);
		Object.assign(this, { ...props });
	}
}
