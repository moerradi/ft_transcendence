import { create } from 'zustand';
import Channel from '../modules/channel';
import DMs from '../modules/dms';
import { combine } from 'zustand/middleware';
import { faker } from '@faker-js/faker';
import DMsMsg from '../modules/dmsmsg';
import ChannelUser from '../modules/channeluser';
import { ChannelUserStatus } from '../modules/channeluser';
import { ChannelUserRole } from '../modules/channeluser';

// const createRandomDMsMsg = (): DMsMsg => {
//   return {
//     id: faker.datatype.uuid(),
//     author_id: faker.datatype.uuid(),
//     content: faker.lorem.sentence(),
//     sent_at: faker.date.past(),
//     author: {
//       avatar_url: faker.image.avatar(),
//       login: faker.name.firstName(),
//     },
//     channel_id: faker.datatype.uuid(),
//   };
// };

// const createRandomDMsMsgList = (): Array<DMsMsg> => {
//   let msgs: Array<DMsMsg> = [];
//   for (let i = 0; i < 10; i++) {
//     msgs.push(createRandomDMsMsg());
//   }
//   return msgs;
// };

// const createRandomChannelUser = (): ChannelUser => {
//   return new ChannelUser(
//     faker.datatype.uuid(),
//     faker.name.fullName(),
//     faker.image.avatar(),
//     faker.datatype.uuid(),
//     faker.helpers.arrayElement([
//       ChannelUserStatus.REQUESTED,
//       ChannelUserStatus.MEMBER,
//       ChannelUserStatus.ADMIN,
//       ChannelUserStatus.DECLINED,
//       ChannelUserStatus.BANNED,
//     ]),
//     faker.helpers.arrayElement([
//       ChannelUserRole.ADMIN,
//       ChannelUserRole.REGULAR,
//     ]),
//     faker.date.past()
//   );
// };

// const createRandomChannelUserList = (): Array<ChannelUser> => {
//   let users: Array<ChannelUser> = [];
//   for (let i = 0; i < 10; i++) {
//     users.push(createRandomChannelUser());
//   }
//   return users;
// };

const useCurrentChat = create(
  combine({ item: null as Channel | DMs | null }, (set) => ({
    setCurrentChat: (item: Channel | DMs) =>
      set((state) => ({ item: item as Channel | DMs })),
  }))
);

export default useCurrentChat;
// export { createRandomDMsMsg, createRandomDMsMsgList };
// export { createRandomChannelUser, createRandomChannelUserList };
