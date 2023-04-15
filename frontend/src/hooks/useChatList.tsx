import { create } from "zustand";
import User from "../modules/user";
import Channel from "../modules/channel";
import DMs from "../modules/dms";
import { Status } from "../modules/user";
import { combine } from "zustand/middleware";
import { faker } from '@faker-js/faker';
import { ChannelType } from "../modules/channel";

// interface ChannelListStore {
// 	  channels: Channel[];
// 	  add: (channel: Channel) => void;
// 	  remove: (channel: Channel) => void;
// 	  activeChannel: Channel | null;
// }

// interface DMsListStore {
// 	  dms: DMs[];
// 	  add: (dms: DMs) => void;
// 	  remove: (dms: DMs) => void;
// 	  activeDMs: DMs | null;
// }

// function createRandomChannel(): Channel {
// 	return new Channel(faker.datatype.uuid(), faker.name.fullName(), faker.datatype.uuid(), faker.helpers.arrayElement([ChannelType.PUBLIC, ChannelType.PROTECTED,, ChannelType.PRIVATE,]), faker.image.avatar(), faker.name.lastName());
// }

// function createRandonChannelList(): Array<Channel> {
// 	let channels: Array<Channel> = [];
// 	for (let i = 0; i < 10; i++) {
// 		channels.push(createRandomChannel());
// 	}
// 	return channels;
// }

// function createRandomDM(): DMs {
// 	let user: User = new User(faker.datatype.uuid(), faker.name.fullName(), faker.image.avatar(), faker.helpers.arrayElement([Status.ONLINE, Status.OFFLINE, Status.INGAME,]), faker.datatype.number(), faker.datatype.number());
// 	return new DMs(faker.datatype.uuid(), user);
// }

// function createRandomDMList(): Array<DMs> {
// 	let channels: Array<DMs> = [];
// 	for (let i = 0; i < 10; i++) {
// 		channels.push(createRandomDM());
// 	}
// 	return channels;
// }



const useChatList = create(
	combine({items: [] as Array<Channel | DMs> , activeItem: null as (Channel | DMs | null)}, (set) => ({
		add: (item: Channel | DMs) => set((state) => ({items: [...state.items, item] as Array<Channel | DMs>})),
		remove: (itemId: string) => set((state) => ({items: state.items.filter((i : Channel | DMs) => {
			if (i.id !== itemId)
			return  i as Channel | DMs;
		}) as Array<Channel | DMs> })),
		setActiveItem: (itemId: string) => set((state) => ({activeItem: state.items.find((i : Channel | DMs) => i.id === itemId) as Channel | DMs})),
		setItems: (myitems: Array<Channel | DMs>) => set((state) => ({items: myitems as Array<Channel | DMs>})),
	}))
);


export default useChatList;
// export { createRandonChannelList, createRandomChannel };
// export { createRandomDMList, createRandomDM };