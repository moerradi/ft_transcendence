enum ChannelUserStatus {
	REQUESTED = "requested",
	MEMBER = "member",
	ADMIN = "admin",
	DECLINED = "declined",
	BANNED = "banned",
}

enum ChannelUserRole {
	ADMIN = "admin",
	REGULAR = "regular",
}

class ChannelUser {
	private _id: string;
	private _name: string;
	private _avatar: string;
	private _channelId: number;
	private _status: ChannelUserStatus;
	private _role: ChannelUserRole;
	private _muted_until: Date;

	constructor(id: string, name:string, avatar: string, channelId: number, status: ChannelUserStatus, role: ChannelUserRole, muted_until: Date) {
		this._id = id;
		this._name = name;
		this._avatar = avatar;
		this._channelId = channelId;
		this._status = status;
		this._role = role;
		this._muted_until = muted_until;
	}

	get id() {
		return this._id;
	}

	get name() {
		return this._name;
	}

	get avatar() {
		return this._avatar;
	}

	get channelId() {
		return this._channelId;
	}
	
	get status() {
		return this._status;
	}

	get role() {
		return this._role;
	}

	get muted_until() {
		return this._muted_until;
	}

	static fromJson(json: any) {
		return new ChannelUser(json.id, json.name, json.avatar ,json.channelId, json.status, json.role, json.muted_until);
	}

	toJson() {
		return {
			id: this._id,
			name: this._name,
			avatar: this._avatar,
			channelId: this._channelId,
			status: this._status,
			role: this._role,
			muted_until: this._muted_until,
		};
	}


}

export default ChannelUser;
export { ChannelUserStatus, ChannelUserRole };