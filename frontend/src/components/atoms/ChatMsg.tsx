interface ChatMsgProps {
  content: string;
  owner: boolean;
  author: {
    login: string;
    avatar_url: string;
  };
}

function ChatMsg({ content, owner, author }: ChatMsgProps) {
  console.log(author);
  return (
    <div className={'chat-msg ' + (owner ? 'owner' : '')}>
      <div className="chat-msg-info">
        <img
          src={
            author.avatar_url.startsWith('http')
              ? author.avatar_url
              : process.env.REACT_APP_API_URL + 'static' + author.avatar_url
          }
          alt={author.login}
        />
      </div>
      {/* <div className='chat-msg-content'> */}
      <div
        className={
          'message-blurb-container ' + (owner ? 'blurb-container-owner' : '')
        }
      >
        <p className={'message-blurb ' + (owner ? 'blurb-owner' : '')}>
          {content}
        </p>
      </div>
    </div>
  );
}

export default ChatMsg;
