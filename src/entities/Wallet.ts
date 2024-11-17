import nano, { DocumentScope, ServerScope } from "nano";

import {
	Account,
	Budget,
	Category,
	Currency,
	Document,
	DocumentType,
	DocumentTypeProps,
	RecordEntry,
	Template,
} from ".";
import { Client } from "../Client";
import { ENVELOPES } from "../constants";
import { IWalletGroup } from "../types";
import { Debt } from "./Debt";
import { Envelope } from "./Envelope";
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

	private async fetchLastData(poll = false): Promise<void> {
		if (!this.db || !this.nano) return;

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
		const { rows } = await this.db.fetch({
			keys: keysToList,
		});

		const objectModels = {
			Account,
			Budget,
			Category,
			Currency,
			Debt,
			Record: RecordEntry,
			Template,
			HashTag,
		} as const;

		for (const row of rows) {
			if ("error" in row || !row.doc || !("reservedModelType" in row.doc)) continue; // not a valid document

			const rawDoc = row.doc as DocumentTypeProps;
			this.rawDocs.set(row.key, rawDoc);
			const Model = objectModels[rawDoc.reservedModelType] as unknown as typeof Document;

			if (!Model) continue;

			const doc = new Model({
				...rawDoc,
				wallet: this,
			});
			this.docs.set(row.key, doc as DocumentType);
		}

		for (const key of keysToDelete) {
			this.rawDocs.delete(key);
			this.docs.delete(key);
		}
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
		return doc?.reservedModelType === "Account" ? doc : null;
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
		return doc?.reservedModelType === "Currency" ? doc : null;
	}

	public get currencies(): Currency[] {
		const currencies = [...this.docs.values()].filter(
			(d) => d.reservedModelType === "Currency",
		);
		return currencies;
	}

	public getCategory(id: string): Category | null {
		const doc = this.docs.get(id) as DocumentType;
		return doc?.reservedModelType === "Category" ? doc : null;
	}

	public get categories(): Category[] {
		const categories = [...this.docs.values()].filter(
			(d) => d.reservedModelType === "Category",
		);
		return categories;
	}

	public get envelopes(): Envelope[] {
		const envelopes = Object.values(ENVELOPES).map((e) => {
			const category = this.categories.find((c) => c.envelopeId === e.id) || null;
			return new Envelope({
				id: e.id,
				name: e.name,
				customCategory: false,
				parentId: e.parentId,
				color: e.color,
				category,
			});
		});

		for (const envelope of envelopes) {
			const children = envelopes
				.filter((e) => e.parentId === envelope.id)
				.sort((a, b) => (a.name.endsWith("OTHERS") ? -1 : a.name.localeCompare(b.name)));

			if (children.length) envelope.children = children;
		}

		const customCategories = this.categories.filter((c) => c.customCategory);
		for (const category of customCategories) {
			const parent = envelopes.find((e) => e.id === category.envelopeId);

			if (!parent) continue;
			const envelope = new Envelope({
				id: parent.id,
				customCategory: true,
				name: category.name,
				color: category.color,
				parentId: parent.id,
				category,
			});
			envelopes.push(envelope);

			if (!parent.children) parent.children = [];
			parent.children.push(envelope);
		}

		envelopes
			.filter((e) => e.parentId && e.children)
			.forEach((e) => e.children?.sort((a, b) => a.name.localeCompare(b.name)));

		return envelopes;
	}

	public get envelopeTree(): Envelope[] {
		return this.envelopes.filter((e) => !e.parentId);
	}

	public get records(): RecordEntry[] {
		const records = [...this.docs.values()]
			.filter((d) => d.reservedModelType === "Record")
			.sort((a, b) => b.recordDate.toISOString().localeCompare(a.recordDate.toISOString()));
		return records;
	}

	public getHashTag(id: string): HashTag | null {
		const doc = this.docs.get(id) as DocumentType;
		return doc?.reservedModelType === "HashTag" ? doc : null;
	}
}
