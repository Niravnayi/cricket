import React, { useEffect, useState } from 'react';
import { fetchMatchById } from '../../server-actions/matchesActions';
import { MatchDetails } from './types/matchDetails';
import socket from '@/utils/socket';
import { getScoreCardbyId } from '@/server-actions/scorecardActions';
import { Scorecard } from '@/app/matches/types/types';

interface MatchPageProps {
  id: number;
}

const ScoreCardComponent = ({ id }: MatchPageProps) => {
  const [matchDetails, setMatchDetails] = useState<MatchDetails>();
  const [ scoreCard,setScoreCard ] = useState<Scorecard>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchData = await fetchMatchById(id);
        setMatchDetails(matchData);

        if (matchData?.scorecard?.scorecardId) {
          const scorecardResponse = await getScoreCardbyId({
            scorecardId: matchData.scorecard.scorecardId
          });
          setScoreCard(scorecardResponse);
        }
      } 
      catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    socket.on('allBattingStats', () => { /* ... */ });
    socket.on('allBowlingStats', () => { /* ... */ });

    return () => {
      socket.off('allBattingStats');
      socket.off('allBowlingStats');
    };
  }, [id]);

  const renderBattingStats = (teamName: string) => {
    const teamBattingStats = scoreCard?.battingStats.filter(
      (stat) => stat.teamName === teamName
    );
  
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-6">
        <h3 className="text-2xl font-semibold text-center bg-gray-100 py-3">  
          {teamName} Batting Stats
        </h3>
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3 text-left">Player</th>
              <th className="border p-3">Runs</th>
              <th className="border p-3">Balls</th>
              <th className="border p-3">4s</th>
              <th className="border p-3">6s</th>
              <th className="border p-3">SR</th>
            </tr>
          </thead>
          <tbody>
            {teamBattingStats?.map((player) => (
              <tr key={player.playerName}>
                <td className="border p-3">
                  {player.playerName}
                  {player.dismissal && (
                    <div className="text-sm text-gray-600">
                      {player.dismissal}
                    </div>
                  )}
                </td>
                {player.runs === 0 && player.balls === 0 && player.dismissal === 'Yet to bat' ? (
                  <td colSpan={5} className="border p-3 text-center">
                    Yet to bat
                  </td>
                ) : (
                  <>
                    <td className="border p-3 text-center">{player.runs}</td>
                    <td className="border p-3 text-center">{player.balls}</td>
                    <td className="border p-3 text-center">{player.fours}</td>
                    <td className="border p-3 text-center">{player.sixes}</td>
                    <td className="border p-3 text-center">{player.strikeRate}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  const renderBowlingStats = (teamName: string) => {
    const teamBowlingStats = scoreCard?.bowlingStats.filter(
      (stat) => stat.teamName === teamName
    );

    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-6">
        <h3 className="text-2xl font-semibold text-center bg-gray-100 py-3">
          {teamName} Bowling Stats
        </h3>
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3 text-left">Bowler</th>
              <th className="border p-3">Overs</th>
              <th className="border p-3">Maidens</th>
              <th className="border p-3">Runs</th>
              <th className="border p-3">Wickets</th>
              <th className="border p-3">Economy</th>
            </tr>
          </thead>
          <tbody>
            {teamBowlingStats?.map((bowler) => (
              <tr key={bowler.playerId} className="hover:bg-gray-100">
                <td className="border-b p-3">{bowler.playerName}</td>
                <td className="border-b p-3 text-center">{bowler.overs}</td>
                <td className="border-b p-3 text-center">{bowler.maidens}</td>
                <td className="border-b p-3 text-center">{bowler.runsConceded}</td>
                <td className="border-b p-3 text-center">{bowler.wickets}</td>
                <td className="border-b p-3 text-center">{bowler.economyRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (!matchDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-8 px-6">
      <h2 className="text-3xl font-semibold text-center mb-6">Scorecard</h2>
      <div className="space-y-6">
        {matchDetails.firstTeamName && matchDetails.secondTeamName && (
          <div>

            {renderBattingStats(matchDetails.firstTeamName)}
            {renderBowlingStats(matchDetails.secondTeamName)}

            {renderBattingStats(matchDetails.secondTeamName)}
            {renderBowlingStats(matchDetails.firstTeamName)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreCardComponent;