import { create } from 'zustand';
import Channel from '../modules/channel';
import type ChannelMsg from '../modules/channelmsg';
import ChannelUser from '../modules/channeluser';

interface ChatParamsStore {
	channelTab: boolean;
	channelList: Channel[];
	activeChannel: Channel | null;
	activeChannelMessages: ChannelMsg[];
	activeChannelOptions: Channel | null;
	activeChannelOptionsName: string;
	activeChannelOptionsAvatar: string;
	activeChannelPassword: string;
	activeChannelOptionsMembers: ChannelUser[];
	activeChannelMemberOptions: ChannelUser | null
	activeChannelOptionsInviteUsers: ChannelUser[];
	activeChannelSettingsSave: boolean;
	setActiveChannel: (channelId: number) => void;
	setActiveChannelOptions: (channelId: number) => void;
	setChannelList: (channelList: Array<Channel>) => void;
	setActiveChannelMessages: (messages: Array<ChannelMsg>) => void;
    updateActiveChannelMessages: (message: ChannelMsg) => void;
	removeChannel: (channelId: number) => void;
	setChannelTab: (channelTab: boolean) => void;
	setActiveChannelOptionsName: (channelId: number, channelName: string) => void;
	setActiveChannelOptionsAvatar: (channelId: number, channelAvatar: string) => void;
	setActiveChannelNull: () => void;
	setActiveChannelOptionsNull: () => void;
	setActiveChannelOptionsMembers: (members: ChannelUser[]) => void;
	setActiveChannelMemberOptions: (member: ChannelUser) => void;
	setActiveChannelMemberOptionsNull: () => void;
	setActiveChannelOptionsInviteUsers: (users: ChannelUser[]) => void;
	setActiveChannelPassword: (password: string) => void;
	setChannelIsMuted: (channelId: number, isMuted: boolean) => void;
	setActiveChannelSettingsSave: (save: boolean) => void;
}

const useChatParams = create<ChatParamsStore>() ((set) => ({
	channelTab: false,
	channelList: [],
	activeItem: null,
	activeChannel: null,
	activeChannelMessages: [],
	activeChannelOptions: null,
	activeChannelOptionsName: "",
	activeChannelOptionsAvatar: "",
	activeChannelPassword: "",
	activeChannelOptionsMembers: [],
	activeChannelMemberOptions: null,
	activeChannelOptionsInviteUsers: [],
	activeChannelSettingsSave: false,
	setActiveChannel: (channelId: number) => set((state) => {
		const match = state.channelList.find((channel) => channel.id === channelId) as Channel;
		return {activeChannel: match || null, activeItem: match || null};
	}),
	
	setChannelIsMuted: (channelId: number, isMuted: boolean) => set((state) => 
		({channelList: state.channelList.map((channel) => {
			if (channel.id === channelId) {
				channel.isMuted = isMuted;
			}
			return channel;
		})})
	),

    updateActiveChannelMessages: (message: ChannelMsg) => set((state) => ({activeChannelMessages: [...state.activeChannelMessages, message]})),
	
	setActiveChannelOptions: (channelId: number) => set((state) => ({activeChannelOptions: state.channelList.find((channel) => channel.id === channelId) as Channel || null})),
	setChannelList: (channelList: Array<Channel>) => set((state) => ({channelList: channelList})),
	setActiveChannelMessages: (messages: Array<ChannelMsg>) => set((state) => ({activeChannelMessages: messages})),
	removeChannel: (channelId: number) => set((state) => ({channelList: state.channelList.filter((channel) => channel.id !== channelId)})),
	setChannelTab: (channelTab: boolean) => set((state) => ({channelTab: channelTab})),
	setActiveChannelOptionsName: (channelId: number, channelName: string) => set((state) => ({channelList: state.channelList.map((c) => {
		if (c.id === channelId) {
			return {...c, name: channelName} as Channel;
		}
		return c;
	})})),

	setActiveChannelOptionsAvatar: (channelId: number, channelAvatar: string) => set((state) => ({channelList: state.channelList.map((c) => {
		if (c.id === channelId) {
			return {...c, avatar: channelAvatar} as Channel;
		}
		return c;
	})})),
	setActiveChannelOptionsNull: () => set((state) => ({activeChannelOptions: null})),

	setActiveChannelOptionsMembers: (members: ChannelUser[]) => set((state) => ({activeChannelOptionsMembers: members})),
	setActiveChannelMemberOptions: (member: ChannelUser) => set((state) => ({activeChannelMemberOptions: member})),
	setActiveChannelMemberOptionsNull: () => set((state) => ({activeChannelMemberOptions: null})),
	setActiveChannelOptionsInviteUsers: (users:	ChannelUser[]) => set((state) => ({activeChannelOptionsInviteUsers: users})),
	setActiveChannelPassword: (password: string) => set((state) => ({activeChannelPassword: password})),
	setActiveChannelSettingsSave: (save: boolean) => set((state) => ({activeChannelSettingsSave: save})),
	setActiveChannelNull: () => set((state) => ({activeChannel: null})),
}));

export default useChatParams;
