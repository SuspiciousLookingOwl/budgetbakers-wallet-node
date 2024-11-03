import { Document } from "./Document";

export type TemplateProps = {
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
	reservedModelType: "Template";
};

export class Template extends Document implements TemplateProps {
	public note!: string;
	public amount!: number;
	public type!: number;
	public labels!: string[];
	public paymentType!: number;
	public accountId!: string;
	public name!: string;
	public position!: number;
	public currencyId!: string;
	public categoryId!: string;
	public reservedModelType = "Template" as const;

	constructor(props: Template) {
		super(props);
		Object.assign(this, { ...props });
	}
}
