import { Category } from "./Category";

export type EnvelopeProps = {
	id: number;
	customCategory: boolean;
	color: string | null;
	name: string;
	category: Category | null;
	parentId: number | null;
};

export class Envelope {
	public id!: number;
	public customCategory!: boolean;
	public color!: string | null;
	public name!: string;
	public category!: Category | null;
	public parentId!: number | null;
	public children?: Envelope[];

	constructor(props: EnvelopeProps) {
		Object.assign(this, { ...props });
	}
}
