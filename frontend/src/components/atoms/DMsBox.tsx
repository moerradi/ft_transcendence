import DMsInput from './DMsInput'
import DMsMessages from './DMsMessages'
import useDMsParams from '../../hooks/useDMsParams'
import bigcat from '../../assets/svg/bigcat.svg'

function DMsBox() {

	const activeDMs = useDMsParams(state => state.activeDMs);

	return (
		<div className='chat-box copy-book-background retro-border-box trans-orange-box'>
			{ activeDMs && <DMsMessages />}
			{ activeDMs && <DMsInput /> }
			{ !activeDMs && 
			<div className='chat-default-img-container'>
				<img src={bigcat} alt="big cat" className='chat-default-img'/>
			</div>
			}
		</div>
	  )
}

export default DMsBox