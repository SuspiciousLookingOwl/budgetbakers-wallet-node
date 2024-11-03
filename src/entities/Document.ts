import { Wallet } from "./Wallet";

export type DocumentProps = {
	wallet: Wallet;
	_id: string;
	_rev: string;
	reservedUpdatedAt: string;
	reservedOwnerId: string;
	reservedSource: string;
	reservedCreatedAt: string;
	reservedAuthorId: string;
};

export class Document implements DocumentProps {
	public wallet!: Wallet;
	public _id!: string;
	public _rev!: string;
	public reservedUpdatedAt!: string;
	public reservedOwnerId!: string;
	public reservedSource!: string;
	public reservedCreatedAt!: string;
	public reservedAuthorId!: string;

	constructor(props: DocumentProps) {
		Object.assign(this, { ...props });
	}
}
