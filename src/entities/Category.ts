import { Document, DocumentProps } from "./Document";

export type CategoryProps = DocumentProps & {
	customCategory: boolean;
	color: string;
	customName: boolean;
	defaultType: number;
	customColor: boolean;
	envelopeId: number;
	name: string;
	position: number;
	reservedModelType: "Category";
};

export class Category extends Document implements CategoryProps {
	public customCategory!: boolean;
	public color!: string;
	public customName!: boolean;
	public defaultType!: number;
	public customColor!: boolean;
	public envelopeId!: number;
	public name!: string;
	public position!: number;
	public reservedModelType = "Category" as const;

	constructor(props: CategoryProps) {
		super(props);
		Object.assign(this, { ...props });
	}
}
