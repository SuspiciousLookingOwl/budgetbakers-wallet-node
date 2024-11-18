import { Account } from "./Account";
import { Category } from "./Category";
import { Currency } from "./Currency";
import { Document, DocumentProps } from "./Document";
import { Label } from "./Label";

export type BudgetProps = DocumentProps & {
	amount: number;
	changes: BudgetChange[];
	reservedUpdatedAt: Date;
	type: number;
	contactIds: string[];
	labels: string[];
	reservedOwnerId: string;
	categoryIds: string[];
	reservedSource: string;
	accountIds: string[];
	reservedCreatedAt: Date;
	reservedAuthorId: string;
	name: string;
	closed: boolean;
	reservedModelType: "Budget";
	currencyId: string;
	envelopes: number[];
	notifications: BudgetNotification;
	startDate?: string;
	endDate?: string;
};

export interface BudgetChange {
	amount: number;
	date: string;
}

export interface BudgetNotification {
	afterOverspentEnabled: boolean;
	riskCustomAmount: number;
	riskCustomEnabled: boolean;
	riskOverspendingEnabled: boolean;
}

export enum BudgetType {
	WEEK = 0,
	MONTH = 1,
	YEAR = 2,
	ONE_TIME = 4,
}

export class Budget extends Document {
	amount!: number;
	changes!: BudgetChange[];
	type!: BudgetType;
	contactIds!: string[];
	labelIds!: string[];
	reservedOwnerId!: string;
	categoryIds!: string[];
	reservedSource!: string;
	accountIds!: string[];
	name!: string;
	closed!: boolean;
	currencyId!: string;
	envelopes!: number[];
	notifications!: BudgetNotification;
	startDate?: Date;
	endDate?: Date;
	reservedModelType = "Budget" as const;

	constructor(props: BudgetProps) {
		super(props);

		const { labels, startDate, endDate, ...rest } = props;
		Object.assign(this, { ...rest });

		this.amount = props.amount / 100;
		this.changes = props.changes.map((c) => ({
			amount: c.amount / 100,
			date: c.date,
		}));
		this.labelIds = labels;
		this.startDate = startDate ? new Date(startDate) : undefined;
		this.endDate = endDate ? new Date(endDate) : undefined;
	}

	public get account(): Account[] {
		return this.accountIds.map((id) => this.wallet.getAccount(id)!);
	}

	public get currency(): Currency {
		return this.wallet.getCurrency(this.currencyId)!;
	}

	public get category(): Category[] {
		return this.categoryIds.map((id) => this.wallet.getCategory(id)!);
	}

	public get labels(): Label[] {
		return this.labelIds.map((id) => this.wallet.getLabel(id)!);
	}
}
