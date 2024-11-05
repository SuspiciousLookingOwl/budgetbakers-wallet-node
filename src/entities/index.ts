import { Account, AccountProps } from "./Account";
import { Category, CategoryProps } from "./Category";
import { Currency, CurrencyProps } from "./Currency";
import { HashTag, HashTagProps } from "./HashTag";
import { Record, RecordProps } from "./Record";
import { Template, TemplateProps } from "./Template";

export * from "./Account";
export * from "./Category";
export * from "./Currency";
export * from "./Document";
export * from "./Record";
export * from "./Template";
export * from "./Wallet";

export type DocumentType = Account | Category | Currency | Template | Record | HashTag;

export type DocumentTypeProps =
	| AccountProps
	| CategoryProps
	| CurrencyProps
	| TemplateProps
	| RecordProps
	| HashTagProps;
