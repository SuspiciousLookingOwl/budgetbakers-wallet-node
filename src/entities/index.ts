import { Account, AccountProps } from "./Account";
import { Budget, BudgetProps } from "./Budget";
import { Category, CategoryProps } from "./Category";
import { Currency, CurrencyProps } from "./Currency";
import { Debt, DebtProps } from "./Debt";
import { Goal, GoalProps } from "./Goal";
import { HashTag, HashTagProps } from "./HashTag";
import { PlannedPayment, PlannedPaymentProps } from "./PlannedPayment";
import { RecordEntry, RecordProps } from "./Record";
import { ShoppingList, ShoppingListProps } from "./ShoppingList";
import { Template, TemplateProps } from "./Template";

export * from "./Account";
export * from "./Budget";
export * from "./Category";
export * from "./Currency";
export * from "./Debt";
export * from "./Document";
export * from "./Envelope";
export * from "./Goal";
export * from "./PlannedPayment";
export * from "./Record";
export * from "./ShoppingList";
export * from "./Template";
export * from "./Wallet";

export type DocumentType =
	| Account
	| Budget
	| Category
	| Currency
	| Debt
	| Goal
	| PlannedPayment
	| RecordEntry
	| ShoppingList
	| Template
	| HashTag;

export type DocumentTypeProps =
	| AccountProps
	| BudgetProps
	| CategoryProps
	| CurrencyProps
	| DebtProps
	| GoalProps
	| PlannedPaymentProps
	| RecordProps
	| ShoppingListProps
	| TemplateProps
	| HashTagProps;
