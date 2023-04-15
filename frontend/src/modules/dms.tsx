import User from './user';
import DMsMsg from './dmsmsg';

class DMs {
	private _id: string;
	private _user : User;
	// private _messages: DMsMsg[];

	constructor(id: string, user: User) {
		this._id = id;
		this._user = user;
		// this._messages = messages;
	}

	get user() {
		return this._user;
	}

	get id() {
		return this._id;
	}

	// get messages() {
	// 	return this._messages;
	// }

	set user(user: User) {
		this._user = user;
	}

	// set messages(messages: DMsMsg[]) {
	// 	this._messages = messages;
	// }

	set id(id: string) {
		this._id = id;
	}

	static fromJson(json: any) {
		return new DMs(json.id, User.fromJson(json.user));
	}

	static fromJsonArray(json: any[]) {
		return json.map(DMs.fromJson);
	}

	toJson() {
		return {
			user: this._user.toJson(),
			// messages: this._messages.map((msg) => msg.toJson())
		};
	}
}

export default DMs;