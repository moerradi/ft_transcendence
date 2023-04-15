import { useState } from 'react';
import squares from '../assets/img/squares.png';
import ImgButton from './ImgButton';
import le_chat from './../assets/svg/le_chat.svg';
import les_chats from './../assets/svg/les_chats.svg';
import useChatParams from '../hooks/useChatParams';
import useDMsParams from '../hooks/useDMsParams';
import ChatDisplay from './ChatDisplay';
import DMsDisplay from './DMsDisplay';


interface ChatTabBoxProps {
	title: string;
	avatar: string;
}

function ChatTabBox() {

	const [activeTab, setActiveTab] = useState(0);

	const activeChannel = useChatParams(state => state.activeChannel);
	const activeDMs = useDMsParams(state => state.activeDMs);

	const changeTab = (index : number) => {
		setActiveTab(index);
	}

	return (
		<div className='tab-box box-container retro-border-box light-box'>
			
			<div className={"tabs-header orange-header"}>
				<div className='tabs-container'>
	
					
				<ImgButton classes={activeTab === 0? "tab active-tab" : "tab"} src={le_chat} alt={""} onClick={() => changeTab(0)} />
				<ImgButton classes={activeTab === 1? "tab active-tab" : "tab"} src={les_chats} alt={""} onClick={() => changeTab(1)} />
						
				</div>
				<div className='tab-box-title'>
					<h1>{ (activeTab === 0) ? activeDMs?.user.name ?? "Welcome To Chat!" : activeChannel?.name ?? "Welcome To Chat!"}</h1>
				</div>
				<div className='tab-box-avatar-container'>
					<img src={(activeTab === 0) ? activeDMs?.user.avatar ?? squares : activeChannel?.avatar ?? squares} className="tab-box-avatar" alt='avatar' />
				</div>
			</div>
			
			<div className='tabs-content'>
				
				<div className={(activeTab === 0) ? "tab-content active-tab-content" : "tab-content"}>
					<DMsDisplay />
				</div>
				<div className={(activeTab === 1) ? "tab-content active-tab-content" : "tab-content"}>
					<ChatDisplay />
				</div>
			</div>
		</div>
	  );
}

export default ChatTabBox


