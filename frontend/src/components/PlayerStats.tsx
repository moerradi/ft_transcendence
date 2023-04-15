import React, { useEffect } from 'react';
import happyflower from './../assets/svg/happyflower.svg';
import sadflower from './../assets/svg/sadflower.svg';
import whiteflower from './../assets/svg/whiteflower.svg';
import { useAuth } from '../useAuth';
import { useParams } from 'react-router-dom';
import api from '../api/api';

function PlayerStats() {
	const { login } = useParams();
	const [xp, setXp] = React.useState<number>(0);
	const [level, setLevel] = React.useState<number>(0);
	const [wins, seWins] = React.useState<number>(0);
	const [losses, setLosses] = React.useState<number>(0);
	const [draws, setDraws] = React.useState<number>(0);
	const { user, loading } = useAuth();

	useEffect(() => {
		if (loading) return;
		let param = login;
		if (login == null) {
		  param = user.login;
		}
		api
		  .get("/profile/" + param + "/info")
		  .then((res) => {
			console.log("here stats",res.data);
			setXp(res.data.exp)
			setLevel(res.data.level)
			seWins(res.data.winPercentage)
			setLosses(res.data.lossPercentage)
			setDraws(res.data.drawPercentage)
		  })
	  }, [loading]);

  return (
	<div className='player-stats-box retro-border-box copy-book-background trans-pink-box'>
		<h1>Statistics:</h1>
		<div className='player-stats-container'>
			<div className='flower-stats-container'>
				<img src={whiteflower} alt="" />
				<span className='flower-number-span'>{draws ?? 0}%</span>
				<span className='flower-text-span'>draws</span>
			</div>
			<div className='flower-stats-container'>
				<img src={happyflower} alt="" />
				<span className='flower-number-span'>{wins}%</span>
				<span className='flower-text-span'>wins</span>
			</div>
			<div className='flower-stats-container'>
				<img src={sadflower} alt="" />
				<span className='flower-number-span'>{losses}%</span>
				<span className='flower-text-span'>losses</span>
			</div>
		</div>
		<div className='xp-level-bar-container'>
			<span> LEVEL {level} - {xp}XP</span>
			<div className='xp-level-bar'>
				{/* <div className='xp-level-bar-fill'></div> */}
			</div>
		</div>
	</div>
  )
}

export default PlayerStats