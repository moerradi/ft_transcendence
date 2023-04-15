enum Status {
	  ONLINE = "online",
	  OFFLINE = "offline",
	  INGAME = "playing"
}

class User {
  private _id: string;
  private _name: string;
  private _avatar: string;
  private _status: Status;
  private _level: number;
  private _xp: number;

  constructor(id: string, name: string, avatar: string, status: Status = Status.ONLINE, level: number = 1, xp: number = 0) {
    this._id = id;
    this._name = name;
    this._avatar = avatar;
    this._status = status;
    this._level = level;
    this._xp = xp;
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

  get status() {
    return this._status;
  }

  get level() {
    return this._level;
  }

  get xp() {
    return this._xp;
  }
  set name(name: string) {
    this._name = name;
  }

  set avatar(avatar: string) {
    this._avatar = avatar;
  }

  static fromJson(json: any) {
    return new User(json.id, json.name, json.avatar, json.status, json.level, json.xp);
  }

  toJson() {
    return {
      id: this._id,
      name: this._name,
      avatar: this._avatar,
    };
  }
}

const user: User = User.fromJson({
  id: "1",
  name: "John",
});

export default User;
export { Status };