import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../useAuth';
import api from '../api/api';
import { AxiosError } from 'axios';


function MatchHistory() {
	const [matches, setMatches] = React.useState<any>([])
	const { login } = useParams();
	const { user, loading } = useAuth();
	const nav = useNavigate();

	useEffect(() => {
		if (loading) return;
		let param = login;
		if (login == null) {
		  param = user.login;
		}
		api
		  .get("/profile/" + param + "/info")
		  .then((res) => {
			console.log("here matches", res.data);
			setMatches(res.data.matchHistory)
		  })
		  .catch((err: AxiosError) => {
			if (err.response) {
			  if (err.response.status === 404) nav("/404", { replace: true });
			}
		  });

	  }, [loading, login]);
  return (
	<div className='match-history-box retro-border-box trans-pink-box copy-book-background'>
		<h1>Match History:</h1>
		<div className='match-history-list scrollable'>

		{
			matches.map((match: any, index: number) => {
				return (
					<div className='match-history-list-item match-history-draw' key={index}>
						<div className='match-history-mode'>{match.game_mode}</div>
						<div className='match-history-details'>
							<span className='match-history-owner'>{match.player_one}</span>
							<span className='match-history-owner-score'>{match.player_one_score}</span>
							<span className='match-history-dash'>-</span>
							<span className='match-history-opponent-score'>{match.player_two_score}</span>
							<span className='match-history-opponent'>{match.player_two}</span>
						</div>
						<div className='match-history-xp'>+{match.exp}XP</div>
					</div>
				)
			})

		}
		</div>
	</div>
  )
}

export default MatchHistory