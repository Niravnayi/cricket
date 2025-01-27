import React, { useEffect, useState } from 'react';
import {
  fetchMatchById,
  fetchTeamPlayers,
  updateMatchState,
  addBattingStats,
  updateBattingStats,
  addBowlingStats,
  updateBowlingStats,
  getBattingStats,
  getMatchState,
} from '../../server-actions/matchesActions';
import { Team } from './types/matchDetails';
import { MatchDetails, BattingStats, BowlingStats } from './types/matchDetails';
import socket from '@/utils/socket';

interface MatchPageProps {
  id: number;
}

const TeamSquadComponents = ({ id }: MatchPageProps) => {
  const [matchDetails, setMatchDetails] = useState<MatchDetails>();
  const [firstTeam, setFirstTeam] = useState<Team[]>([]);
  const [secondTeam, setSecondTeam] = useState<Team[]>([]);
  const [Batting, setBattingDetails] = useState<BattingStats[]>([]);
  const [matchState, setMatchState] = useState<{ batter1Id: number | null; batter2Id: number | null; bowlerId: number | null } | null>(null);
  const [playerSelections, setPlayerSelections] = useState({
    batter1Id: null as number | null,
    batter2Id: null as number | null,
    bowlerId: null as number | null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchDetails = await fetchMatchById(id);
        setMatchDetails(matchDetails);

        const battingDetails = await getBattingStats();
        setBattingDetails(battingDetails);

        const playersData = await fetchTeamPlayers({
          firstTeamId: matchDetails.firstTeamId,
          secondTeamId: matchDetails.secondTeamId,
        });

        setFirstTeam(playersData.firstTeam);
        setSecondTeam(playersData.secondTeam);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();

    const fetchMatchState = async () => {
      const response = await getMatchState({ matchId: matchDetails?.matchId ?? 20 });
      setMatchState(response);
    };

    fetchMatchState();

    socket.on('allDismissedStats', ({ battingStats }: BattingStats[]) => {
      setBattingDetails((prevStats) => {
        const existingStatsMap = new Map(
          prevStats.map((batsman) => [batsman.playerId, batsman])
        );

        const updatedStats = battingStats.map((newStat) => {
          const existingStat = existingStatsMap.get(newStat.playerId);
          return existingStat ? { ...existingStat, ...newStat } : newStat;
        });

        return updatedStats;
      });
    });

    return () => {
      socket.off('allDismissedStats');
    };
  }, [id]);

  const handlePlayerSelection = (playerId: number, role: 'batter1Id' | 'batter2Id' | 'bowlerId') => {
    setPlayerSelections((prevSelections) => ({
      ...prevSelections,
      [role]: playerId,
    }));
  };

  const handleSubmitAllSelections = async () => {
    if (!matchDetails?.matchId) return;

    const newBattingStatsData = [
      {
        playerId: playerSelections.batter1Id,
        isNew: !Batting.some((stat) => stat.playerId === playerSelections.batter1Id),
        teamId: matchDetails.firstTeamId,
      },
      {
        playerId: playerSelections.batter2Id,
        isNew: !Batting.some((stat) => stat.playerId === playerSelections.batter2Id),
        teamId: matchDetails.firstTeamId,
      },
    ];

    const newBowlingStatsData = {
      playerId: playerSelections.bowlerId,
      isNew: !Batting.some((stat) => stat.playerId === playerSelections.bowlerId),
      teamId: matchDetails.secondTeamId,
    };
    
    try {
      // Handle Batting Stats
      for (const batting of newBattingStatsData) {
        const existingStatsId = Batting.find((b) => b.playerId === batting.playerId)?.battingStatsId;

        if (existingStatsId) {
          const updateData: BattingStats = {
            scorecardId: matchDetails.scorecard?.scorecardId || 0,
            playerId: batting.playerId || 0,
            teamId: batting.teamId,
            playerName: firstTeam.find((player) => player.playerId === batting.playerId)?.playerName || '',
            teamName: matchDetails.firstTeamName || '',
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            strikeRate: 0,
            dismissal: 'Not Out',
          };

          await updateBattingStats({ updateBatting: updateData, battingStatsId: existingStatsId });
        } else if (batting.playerId) {
          const addData: BattingStats[] = [
            {
              scorecardId: matchDetails.scorecard?.scorecardId || 0,
              playerId: batting.playerId,
              teamId: batting.teamId,
              playerName: firstTeam.find((player) => player.playerId === batting.playerId)?.playerName || '',
              teamName: matchDetails.firstTeamName || '',
              runs: 0,
              balls: 0,
              battingStatsId: 0,
              fours: 0,
              sixes: 0,
              strikeRate: 0,
              dismissal: 'Not Out',
            },
          ];
          await addBattingStats(addData);
        }
      }
      
      // Handle Bowling Stats
      if (newBowlingStatsData.playerId) {
        if (newBowlingStatsData.isNew) {
          const addBowlingData: BowlingStats = {
            scorecardId: matchDetails.scorecard?.scorecardId || 0,
            playerId: newBowlingStatsData.playerId,
            teamId: newBowlingStatsData.teamId,
            playerName: secondTeam.find((player) => player.playerId === newBowlingStatsData.playerId)?.playerName || '',
            teamName: matchDetails.secondTeamName || '',
            overs: 0,
            maidens: 0,
            runsConceded: 0,
            wickets: 0,
            economyRate: 0,
          };
          await addBowlingStats({ bowlingStatsData: addBowlingData });
        } else {
          const existingBowlerStatsId = Batting.find((b) => b.playerId === newBowlingStatsData.playerId)?.battingStatsId;
          
          if (existingBowlerStatsId) {
            const updateBowlingData = {
              scorecardId: matchDetails.scorecard?.scorecardId || 0,
              playerId: newBowlingStatsData.playerId!,
              teamId: newBowlingStatsData.teamId,
              playerName: secondTeam.find((player) => player.playerId === newBowlingStatsData.playerId)?.playerName || '',
              teamName: matchDetails.secondTeamName || '',
              overs: 0,
              maidens: 0,
              runsConceded: 0,
              wickets: 0,
              economyRate: 0,
            };
            await updateBowlingStats({ updateBowling: updateBowlingData, bowlingStatsId: existingBowlerStatsId });
          }
        }
      }
      
      const matchStateData = {
        matchId: matchDetails.matchId,
        currentBatter1Id: playerSelections.batter1Id ?? matchState?.batter1Id,
        currentBatter2Id: playerSelections.batter2Id ?? matchState?.batter2Id,
        currentBowlerId: playerSelections.bowlerId ?? matchState?.bowlerId,
      };
      
      await updateMatchState(matchStateData);
      
      const updatedBattingStats = await getBattingStats();
      setBattingDetails(updatedBattingStats);
    } catch (error) {
      console.error('Error processing batting/bowling stats or updating match state:', error);
    }
  };
  const isSelected = (playerId: number, role: 'batter1Id' | 'batter2Id' | 'bowlerId') => {
    return playerSelections[role] === playerId;
  };
  const isHighlighted = (playerId: number) =>
    playerId === matchState?.batter1Id ||
    playerId === matchState?.batter2Id ||
    playerId === matchState?.bowlerId;


  return (
    <div className="my-8 px-6">
    <h2 className="text-3xl font-semibold text-center mb-6">Team Squads</h2>
    <div className="flex space-x-12 justify-center">
      <div className="flex-1 bg-white shadow-lg rounded-lg overflow-hidden">
        <h3 className="text-2xl font-semibold text-center bg-gray-100 py-3">{matchDetails?.firstTeamName}</h3>
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <tbody>
            {firstTeam.map((player) => (
              <tr key={player.playerId} className={`hover:bg-gray-100 ${isHighlighted(player.playerId) ? 'bg-yellow-300' : ''}`}>
                <td className="border-b p-3">{player.playerName}</td>
                {Batting.find(b => b.playerId === player.playerId)?.dismissal === 'Not Out' || !Batting.find(b => b.playerId === player.playerId) ? (
                  <>
                    <td className="border-b p-3">
                      <button
                        title="Select Batter 1"
                        className={`px-2 py-1 rounded ${isSelected(player.playerId!, 'batter1Id') ? 'bg-blue-500 text-white' : 'text-blue-500 hover:text-blue-700'}`}
                        onClick={() => handlePlayerSelection(player.playerId!, 'batter1Id')}
                      >
                        Batter 1
                      </button>
                    </td>
                    <td className="border-b p-3">
                      <button
                        title="Select Batter 2"
                        className={`px-2 py-1 rounded ${isSelected(player.playerId!, 'batter2Id') ? 'bg-green-500 text-white' : 'text-green-500 hover:text-green-700'}`}
                        onClick={() => handlePlayerSelection(player.playerId!, 'batter2Id')}
                      >
                        Batter 2
                      </button>
                    </td>
                  </>
                ) : (
                  <td className='text-red-500'>{Batting.find(b => b.playerId === player.playerId)?.dismissal}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex-1 bg-white shadow-lg rounded-lg overflow-hidden">
        <h3 className="text-2xl font-semibold text-center bg-gray-100 py-3">{matchDetails?.secondTeamName}</h3>
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <tbody>
            {secondTeam.map((player) => (
              <tr key={player.playerId} className={`hover:bg-gray-100 ${isHighlighted(player.playerId) ? 'bg-yellow-300' : ''}`}>
                <td className="border-b p-3">{player.playerName}</td>
                <td className="border-b p-3">
                  <button
                    title="Select Bowler"
                    className={`px-2 py-1 rounded ${isSelected(player.playerId!, 'bowlerId') ? 'bg-red-500 text-white' : 'text-red-500 hover:text-red-700'}`}
                    onClick={() => handlePlayerSelection(player.playerId!, 'bowlerId')}
                  >
                    Bowler
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="mt-6 flex justify-center">
      <button
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        onClick={handleSubmitAllSelections}
      >
        Submit All Selections
      </button>
    </div>
  </div>
  );
};

export default TeamSquadComponents;
