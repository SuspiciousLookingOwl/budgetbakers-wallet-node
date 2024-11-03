interface UserMember {
	member: IMember;
}

interface IUnregisteredUserMember {
	email: string;
}

interface IMember {
	id: string;
	name: string;
	email: string;
	profilePicture?: string;
}

export interface IWalletGroup {
	id: string;
	name: string;
	database: IDatabase;
	owner: UserMember;
	members: UserMember[];
	unregisteredMembers: IUnregisteredUserMember[];
}

export interface IUserAccount {
	id: string;
	firstName: string;
	lastName: string;
	name: string;
	email: string;
	database: IDatabase;
	groups?: IWalletGroup[];
}

export interface IDatabase {
	name: string;
	host: string;
	user: string;
	password: string;
}
