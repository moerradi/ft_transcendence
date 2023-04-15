import DMsList from './atoms/DMsList'
import DMsBox from './atoms/DMsBox'

function DMsDisplay() {
  return (
		<div className='chat-container'>
			<div className='chat-side-bar copy-book-background retro-border-box trans-orange-box'>
				<DMsList />
			</div>
			<DMsBox />
		</div>
  )
}

export default DMsDisplay