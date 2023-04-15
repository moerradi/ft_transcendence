import PlayerStats from './PlayerStats'
import MatchHistory from './MatchHistory'
import Friends from './Friends'

function Profil() {
  return (
	<div className='profil-container'>
		<div className='player-stats-history-container'>
			<PlayerStats />
			<MatchHistory />
		</div>
		<Friends />
	</div>
  )
}

export default Profil