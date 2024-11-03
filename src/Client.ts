import path from "path";
import protobuf from "protobufjs";
import qs from "querystring";

import { Wallet } from "./entities";
import { IUserAccount, IWalletGroup } from "./types";

export class Client {
	private static apiBaseUrl = "https://api.budgetbakers.com";

	private user: IUserAccount | null = null;
	public cookieId: string | null = null;

	public wallets: Wallet[] = [];

	constructor() {}

	async login(email: string, password: string): Promise<IUserAccount>;
	async login(cookie: string): Promise<IUserAccount>;
	async login(emailOrCookie: string, password?: string): Promise<IUserAccount> {
		let cookieId = emailOrCookie;
		if (password !== undefined) {
			cookieId = await this.authenticate(emailOrCookie, password);
		}
		this.cookieId = cookieId;
		this.user = await this.getUserAccount();

		const wallets = [this.user, ...(this.user.groups || [])].reduce<IWalletGroup[]>(
			(prev, curr) => {
				if (prev.find((p) => p.id === curr.id)) return prev;
				prev.push({
					id: curr.id,
					database: curr.database,
					members: "members" in curr ? curr.members : [],
					name: curr.name,
					owner:
						"owner" in curr
							? curr.owner
							: {
									member: {
										id: curr.id,
										email: curr.email,
										name: curr.name,
									},
								},
					unregisteredMembers:
						"unregisteredMembers" in curr ? curr.unregisteredMembers : [],
				});

				return prev;
			},
			[],
		);

		this.wallets = wallets.map((w) => new Wallet(this, w));
		return this.user;
	}

	private async authenticate(email: string, password: string): Promise<string> {
		const response = await fetch(`${Client.apiBaseUrl}/auth/authenticate/userpass`, {
			body: qs.stringify({
				username: email,
				password: password,
			}),
			method: "POST",
			headers: { "content-type": "application/x-www-form-urlencoded" },
		});

		const cookie = response.headers.get("set-cookie");
		const idCookie = cookie?.split("id=").pop()?.split(";")[0];

		return idCookie || "";
	}

	private async getUserAccount(): Promise<IUserAccount> {
		const userResponse = await fetch(`${Client.apiBaseUrl}/ribeez/user/abc`, {
			method: "GET",
			headers: {
				cookie: `id=${this.cookieId}`,
				flavor: "0",
				platform: "web",
				"web-version-code": "4.18.12",
			},
		});

		const proto = await protobuf.load(path.resolve(__dirname, "./user_account.proto"));
		const user = proto.lookupType("budgetbakers.UserAccount");
		const message = user.decode(new Uint8Array(await userResponse.arrayBuffer()));
		const data = user.toObject(message);
		this.user = data as IUserAccount;

		return this.user;
	}

	public get mainWallet(): Wallet | null {
		if (this.user) return this.wallets.find((w) => w.id === this.user?.id) || null;
		return null;
	}
}
