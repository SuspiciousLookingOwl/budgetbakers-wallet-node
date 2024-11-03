import { Document, DocumentProps } from "./Document";

export type CurrencyProps = DocumentProps & {
	code: string;
	ratioToReferential: number;
	reservedAuthorId: string;
	referential: boolean;
	position: number;
	reservedModelType: "Currency";
};

export class Currency extends Document implements CurrencyProps {
	public code!: string;
	public ratioToReferential!: number;
	public reservedAuthorId!: string;
	public referential!: boolean;
	public position!: number;
	public reservedModelType = "Currency" as const;

	constructor(props: Currency) {
		super(props);
		Object.assign(this, { ...props });
	}
}
