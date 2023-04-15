// import { createContext, useContext, useEffect, useState } from 'react';
import ChatBox from './atoms/ChatBox'
import ChatSearchPlus from './atoms/ChatSearchPlus'
import ChatsList from './atoms/ChatsList'

function ChatDisplay() {

  return (
	<div className='chat-container'>
			<div className='chat-side-bar copy-book-background retro-border-box trans-orange-box'>
				<ChatSearchPlus/>
				<ChatsList />
			</div>
			<ChatBox />
		</div>
  )
}

export default ChatDisplay