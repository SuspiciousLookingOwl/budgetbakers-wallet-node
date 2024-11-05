import nano, { DocumentResponseRow, DocumentScope, ServerScope } from "nano";

import {
	Account,
	Category,
	Currency,
	Document,
	DocumentType,
	DocumentTypeProps,
	Record,
	Template,
} from ".";
import { Client } from "../Client";
import { IWalletGroup } from "../types";
import { HashTag } from "./HashTag";

export class Wallet {
	public id: string;
	private client: Client;
	private active = false;
	private currentSequence = 0;
	private docs = new Map<string, DocumentType>();
	public rawDocs = new Map<string, DocumentTypeProps>();
	private nano: ServerScope;
	private db: DocumentScope<unknown>;

	constructor(client: Client, { id, database }: IWalletGroup) {
		this.id = id;
		this.client = client;

		const token = btoa(`${database.user}:${database.password}`);
		this.nano = nano({
			url: database.host,
			requestDefaults: {
				headers: { authorization: `Basic ${token}` },
			},
		});

		this.db = this.nano.use(database.name);
	}

	public async init() {
		await this.fetchLastData();
	}

	private async fetchLastData(poll = false): Promise<DocumentResponseRow<unknown>[]> {
		if (!this.db || !this.nano) return [];

		const limit = 1000;

		const changes = await this.db.changes({
			style: "all_docs",
			limit,
			feed: poll ? "longpoll" : "normal",
			since: this.currentSequence || undefined,
		});

		this.currentSequence = changes.last_seq;
		const keysToDelete = changes.results.filter((r) => r.deleted).map((r) => r.id);
		const keysToList = changes.results.filter((r) => !r.deleted).map((r) => r.id);
		const { rows } = await this.db.list({
			include_docs: true,
			conflicts: true,
			keys: keysToList,
		});

		const objectModels = {
			Account,
			Category,
			Currency,
			Record,
			Template,
			HashTag,
		} as const;

		for (const row of rows) {
			if (!row.doc || !("reservedModelType" in row.doc)) continue; // not a valid document

			const rawDoc = row.doc as DocumentTypeProps;
			this.rawDocs.set(row.key, rawDoc);
			const Model = objectModels[rawDoc.reservedModelType] as unknown as typeof Document;

			if (Model) {
				const doc = new Model({
					...rawDoc,
					wallet: this,
				});
				this.docs.set(row.key, doc as DocumentType);
			}
		}

		for (const key of keysToDelete) {
			this.rawDocs.delete(key);
			this.docs.delete(key);
		}

		return rows;
	}

	public async startPolling() {
		this.active = true;
		while (this.active) {
			await this.fetchLastData(true);
			await new Promise((r) => setTimeout(r, 5000));
		}
	}

	public stopPolling() {
		this.active = false;
	}

	public async createAccount(account: Partial<Account>) {
		await this.db?.bulk({ docs: [account] });
	}

	public getAccount(id: string): Account | null {
		const doc = this.docs.get(id) as DocumentType;
		return doc.reservedModelType === "Account" ? doc : null;
	}

	public get accounts(): Account[] {
		const accounts = [...this.docs.values()].filter((d) => d.reservedModelType === "Account");
		return accounts;
	}

	public get referentialCurrency(): Currency {
		const currencies = this.currencies;
		return currencies.find((c) => c.referential)!;
	}

	public getCurrency(id: string): Currency | null {
		const doc = this.docs.get(id) as DocumentType;
		return doc.reservedModelType === "Currency" ? doc : null;
	}

	public get currencies(): Currency[] {
		const currencies = [...this.docs.values()].filter(
			(d) => d.reservedModelType === "Currency",
		);
		return currencies;
	}

	public getCategory(id: string): Category | null {
		const doc = this.docs.get(id) as DocumentType;
		return doc.reservedModelType === "Category" ? doc : null;
	}

	public get categories(): Category[] {
		const categories = [...this.docs.values()].filter(
			(d) => d.reservedModelType === "Category",
		);
		return categories;
	}

	public get records(): Record[] {
		const records = [...this.docs.values()]
			.filter((d) => d.reservedModelType === "Record")
			.sort((a, b) => b.recordDate.localeCompare(a.recordDate));
		return records;
	}

	public getHashTag(id: string): HashTag | null {
		console.log(id);
		const doc = this.docs.get(id) as DocumentType;
		console.log(doc);
		return doc.reservedModelType === "HashTag" ? doc : null;
	}
}
