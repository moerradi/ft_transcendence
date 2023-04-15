type ChannelMsg = {
  channel_id: number;
  author_id: number;
  content: string;
  sent_at: Date;
  author: {
    login: string;
    avatar_url: string;
  };
};

export default ChannelMsg;
