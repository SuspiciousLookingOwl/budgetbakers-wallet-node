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

export class Document {
	public wallet!: Wallet;
	public _id!: string;
	public _rev!: string;
	public reservedOwnerId!: string;
	public reservedSource!: string;
	public reservedUpdatedAt!: Date;
	public reservedCreatedAt!: Date;
	public reservedAuthorId!: string;

	constructor(props: DocumentProps) {
		this.wallet = props.wallet;
		this._id = props._id;
		this._rev = props._rev;
		this.reservedOwnerId = props.reservedOwnerId;
		this.reservedSource = props.reservedSource;
		this.reservedUpdatedAt = new Date(props.reservedUpdatedAt);
		this.reservedCreatedAt = new Date(props.reservedCreatedAt);
		this.reservedAuthorId = props.reservedAuthorId;
	}
}
