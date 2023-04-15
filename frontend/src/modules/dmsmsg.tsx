type DMsMsg = {
  id: string;
  channel_id: string;
  author_id: string;
  content: string;
  sent_at: Date;
  author: {
    login: string;
    avatar_url: string;
  };
};

export default DMsMsg;
