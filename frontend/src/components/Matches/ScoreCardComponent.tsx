import React, { useEffect, useState } from 'react';
import {
  fetchMatchById,
  fetchTeamPlayers,
  getBattingStats,
} from '../../server-actions/matchesActions';
import { Team, MatchDetails, BattingStats } from './types/matchDetails';
import socket from '@/utils/socket';

interface MatchPageProps {
  id: number;
}

const ScoreCardComponent = ({ id }: MatchPageProps) => {
  const [matchDetails, setMatchDetails] = useState<MatchDetails>();
  const [firstTeam, setFirstTeam] = useState<Team[]>([]);
  const [secondTeam, setSecondTeam] = useState<Team[]>([]);
  const [battingStats, setBattingStats] = useState<BattingStats[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchDetails = await fetchMatchById(id);
        setMatchDetails(matchDetails);

        const playersData = await fetchTeamPlayers({
          firstTeamId: matchDetails.firstTeamId,
          secondTeamId: matchDetails.secondTeamId,
        });

        setFirstTeam(playersData.firstTeam);
        setSecondTeam(playersData.secondTeam);

        const stats = await getBattingStats();
        setBattingStats(stats);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();

    socket.on('dismissedBatter', (data: { dismissedBatters: string[] }) => {
      setBattingStats((prevStats) =>
        prevStats.map((batsman, index) => ({
          ...batsman,
          dismissal: data.dismissedBatters[index] || batsman.dismissal,
        }))
      );
    });
    async function getAllBattingStats(){
        await getBattingStats()
    }
    getAllBattingStats()
    socket.on('allBattingStats', ({ battingStats }: BattingStats[]) => {
        console.log(battingStats)
        setBattingStats((prevStats) => {
          const existingStatsMap = new Map(
            prevStats.map((batsman) => [batsman.playerId, batsman])
          );

          const updatedStats = battingStats.map((newStat) => {
            const existingStat = existingStatsMap.get(newStat.playerId);
            if (existingStat) {
              // Update the existing stat
              return {
                ...existingStat,
                ...newStat, // Use new stat values to override existing ones
              };
            } else {
              // Add new stat if it doesn't exist
              return newStat;
            }
          });
      
          // Return the combined list of updated and new stats
          return updatedStats;
        });
      });
      
    return () => {
      socket.off('dismissedBatter');
      socket.off('allBattingStats');
    };
  }, [id]);

  const renderScorecard = (team: Team[], teamName: string) => {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <h3 className="text-2xl font-semibold text-center bg-gray-100 py-3">
          {teamName} Scorecard
        </h3>
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3 text-left">Player</th>
              <th className="border p-3">Runs</th>
              <th className="border p-3">Balls</th>
              <th className="border p-3">4s</th>
              <th className="border p-3">6s</th>
              <th className="border p-3">Strike Rate</th>
              <th className="border p-3">Dismissal</th>

            </tr>
          </thead>
          <tbody>
            {team.map((player) => {
              const playerStats = battingStats.find(
                (stat) => stat.playerId === player.playerId
              );

              return (
                <tr key={player.playerId} className="hover:bg-gray-100">
                  <td className="border-b p-3">{player.playerName}</td>
                  {playerStats ? (
                    <>
                      <td className="border-b p-3">{playerStats.runs}</td>
                      <td className="border-b p-3">{playerStats.balls}</td>
                      <td className="border-b p-3">{playerStats.fours}</td>
                      <td className="border-b p-3">{playerStats.sixes}</td>
                      <td className="border-b p-3">
                        {playerStats.strikeRate.toFixed(2)}
                      </td>
                      <td className="border-b p-3">{playerStats.dismissal}</td>
                    </>
                  ) : (
                    <td
                      className="border-b p-3 text-center"
                      colSpan={5}
                      style={{ color: 'gray' }}
                    >
                      Yet to Bat
                    </td>
                  )}
                </tr>
              );
            })}
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
        {matchDetails.firstTeamName && matchDetails.secondTeamName && <div>
            {renderScorecard(firstTeam, matchDetails.firstTeamName)}
        {renderScorecard(secondTeam, matchDetails.secondTeamName)}
            </div>}
        
      </div>
    </div>
  );
};

export default ScoreCardComponent;
