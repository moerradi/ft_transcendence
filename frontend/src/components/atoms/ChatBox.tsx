import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import useChatParams from '../../hooks/useChatParams';
import bigcat from '../../assets/svg/bigcat.svg';
import { ChannelType } from '../../modules/channel';
import ChatProtected from './ChatProtected';

function ChatBox() {

  const activeChannel = useChatParams(state => state.activeChannel);

  return (
	<div className='chat-box copy-book-background retro-border-box trans-orange-box'>
		{ !activeChannel && 
			<div className='chat-default-img-container'>
				<img src={bigcat} alt="big cat" className='chat-default-img'/>
			</div>
		}
		{ activeChannel && (activeChannel.type !== ChannelType.PROTECTED) && <ChatMessages />}
		{ activeChannel && (activeChannel.type !== ChannelType.PROTECTED) && <ChatInput />}
		{ activeChannel && (activeChannel.type === ChannelType.PROTECTED) && <ChatProtected />}
	</div>
  )
}

export default ChatBox
