class ChatModel {
	private _id: string;
	private _name: string;
	constructor(id: string, name: string) {
		this._id = id;
		this._name = name;
	}
		
	get id() {
		return this._id;
	}

	get name() {
		return this._name;
	}

	set id(id : string) {
		this._id = id;
	}

	set name(name: string) {
		this._name = name;
	}

	static fromJson(json: any) {
		return new ChatModel(json.id, json.name);
	}

	static fromJsonArray(json: any[]) {
		return json.map(ChatModel.fromJson);
	}

	toJson() {
		return {
			id: this._id,
			name: this._name
		};
	}
}

export default ChatModel;