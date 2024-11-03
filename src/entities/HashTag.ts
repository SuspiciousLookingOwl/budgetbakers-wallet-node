import { Document, DocumentProps } from "./Document";

export type HashTagProps = DocumentProps & {
	color: string;
	archived: boolean;
	autoAssign: boolean;
	name: string;
	position: number;
	reservedModelType: "HashTag";
};

export class HashTag extends Document implements HashTagProps {
	public color!: string;
	public archived!: boolean;
	public autoAssign!: boolean;
	public name!: string;
	public position!: number;
	public reservedModelType = "HashTag" as const;

	constructor(props: HashTag) {
		super(props);
		Object.assign(this, { ...props });
	}
}
