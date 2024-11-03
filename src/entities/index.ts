import { Account } from "./Account";
import { Category } from "./Category";
import { Currency } from "./Currency";
import { HashTag } from "./HashTag";
import { Record } from "./Record";
import { Template } from "./Template";

export * from "./Account";
export * from "./Category";
export * from "./Document";
export * from "./Wallet";
export * from "./Currency";
export * from "./Template";
export * from "./Record";

export type DocumentType = Account | Category | Currency | Template | Record | HashTag;
