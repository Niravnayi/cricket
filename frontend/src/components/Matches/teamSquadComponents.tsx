import React, { useEffect, useState } from 'react';
import { Team } from './types/matchDetails';
import { MatchDetails, BattingStats } from './types/matchDetails';
import socket from '@/utils/socket';
import { fetchMatchById } from '@/server-actions/matchesActions';
import { addBattingStats, getBattingStats, updateBattingStats } from '@/server-actions/battingStatsActions';
import { fetchTeamPlayers } from '@/server-actions/teamPlayersActions';
import { getMatchState, updateMatchState } from '@/server-actions/matchStateActions';
import { addBowlingStats, updateBowlingStats } from '@/server-actions/bowlingStatsAction';

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
  const [isInningSelected, setIsInningSelected] = useState<'first' | 'second' | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchData = await fetchMatchById(id);
        setMatchDetails(matchData);

        const battingDetails = await getBattingStats();
        setBattingDetails(battingDetails);

        const playersData = await fetchTeamPlayers({
          firstTeamId: matchData.firstTeamId,
          secondTeamId: matchData.secondTeamId,
        });

        setFirstTeam(playersData.firstTeam);
        setSecondTeam(playersData.secondTeam);
      } 
      catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();

    const fetchMatchState = async () => {
      console.log(matchDetails)
      const response = await getMatchState({ matchId: matchDetails?.matchId ?? 27 });
      setMatchState(response);
    };

    fetchMatchState();

    socket.on('allDismissedStats', ({ battingStats }: { battingStats: BattingStats[] }) => {
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

    const battingTeamId = isInningSelected === 'first' ? matchDetails.firstTeamId : matchDetails.secondTeamId;
    const bowlingTeamId = isInningSelected === 'first' ? matchDetails.secondTeamId : matchDetails.firstTeamId;

    const newBattingStatsData = [
      {
        playerId: playerSelections.batter1Id,
        isNew: !Batting.some((stat) => stat.playerId === playerSelections.batter1Id),
        teamId: battingTeamId,
      },
      {
        playerId: playerSelections.batter2Id,
        isNew: !Batting.some((stat) => stat.playerId === playerSelections.batter2Id),
        teamId: battingTeamId,
      },
    ];

    const newBowlingStatsData = {
      playerId: playerSelections.bowlerId,
      isNew: !Batting.some((stat) => stat.playerId === playerSelections.bowlerId),
      teamId: bowlingTeamId,
    };

    try {
      for (const batting of newBattingStatsData) {
        const existingStatsId = Batting.find((b) => b.playerId === batting.playerId)?.battingStatsId;

        if (existingStatsId) {
          const updateBatting = {
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
          await updateBattingStats({ ...updateBatting, battingStatsId: existingStatsId });
        } 
        else if (batting.playerId) {
          const battingStatsData = [
            {
              scorecardId: matchDetails.scorecard?.scorecardId ?? 0,
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
          await addBattingStats(battingStatsData);
        }
      }

      if (newBowlingStatsData.playerId) {
        if (newBowlingStatsData.isNew) {
          const addBowlingData = {
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
        } 
        else {
          const existingBowlerStatsId = Batting.find((b) => b.playerId === newBowlingStatsData.playerId)?.battingStatsId;

          if (existingBowlerStatsId) {
            const bowlingStatsData = {
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
            await updateBowlingStats({ bowlingStatsData, bowlingStatsId: existingBowlerStatsId });
          }
        }
      }

      const matchStateData = {
        matchId: matchDetails.matchId,
        currentBatter1Id: playerSelections.batter1Id ?? matchState?.batter1Id ?? 0,
        currentBatter2Id: playerSelections.batter2Id ?? matchState?.batter2Id ?? 0,
        currentBowlerId: playerSelections.bowlerId ?? matchState?.bowlerId ?? 0,
      };
  
      await updateMatchState(matchStateData);

      const updatedBattingStats = await getBattingStats();
      setBattingDetails(updatedBattingStats);
    } 
    catch (error) {
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

      <div className="flex justify-center space-x-4 mb-4">
        <div>
          <input
            type="checkbox"
            title="Select First Team"
            checked={isInningSelected === 'first'}
            onChange={() => setIsInningSelected(isInningSelected === 'first' ? null : 'first')}
          />
          <label className="ml-2">First Team</label>
        </div>
        <div>
          <input
            title='Select Second Team'
            type="checkbox"
            checked={isInningSelected === 'second'}
            onChange={() => setIsInningSelected(isInningSelected === 'second' ? null : 'second')}
          />
          <label className="ml-2">Second Team</label>
        </div>
      </div>

      <div className="flex space-x-12 justify-center">
        <div className="flex-1 bg-white shadow-lg rounded-lg overflow-hidden">
          <h3 className="text-2xl font-semibold text-center bg-gray-100 py-3">{matchDetails?.firstTeamName}</h3>
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <tbody>
              {firstTeam.map((player) => (
                <tr key={player.playerId} className={`hover:bg-gray-100 ${player.playerId !== undefined && isHighlighted(player.playerId) ? 'bg-yellow-300' : ''}`}>
                  <td className="border-b p-3">{player.playerName}</td>
                  {isInningSelected === 'first' && (
                    <>
                      <td className="border-b p-3">
                        <button
                          title="Select Batter 1"
                          className={`px-2 py-1 rounded ${isSelected(player.playerId!, 'batter1Id') ? 'bg-red-500 text-white' : 'text-red-500 hover:text-red-700'}`}
                          onClick={() => player.playerId !== undefined && handlePlayerSelection(player.playerId, 'batter1Id')}
                        >
                          Batter 1
                        </button>
                      </td>
                      <td className="border-b p-3">
                        <button
                          title="Select Batter 2"
                          className={`px-2 py-1 rounded ${player.playerId !== undefined && isSelected(player.playerId, 'batter2Id') ? 'bg-red-500 text-white' : 'text-red-500 hover:text-red-700'}`}
                          onClick={() => player.playerId !== undefined && handlePlayerSelection(player.playerId, 'batter2Id')}
                        >
                          Batter 2
                        </button>
                      </td>
                    </>
                  )}
                  {/* Add bowler selection button when inning is not selected for team */}
                  {isInningSelected !== 'first' && (
                    <td className="border-b p-3">
                      <button
                        title="Select Bowler"
                        className={`px-2 py-1 rounded ${isSelected(player.playerId!, 'bowlerId') ? 'bg-green-500 text-white' : 'text-green-500 hover:text-green-700'}`}
                        onClick={() => player.playerId !== undefined && handlePlayerSelection(player.playerId, 'bowlerId')}
                      >
                        Bowler
                      </button>
                    </td>
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
                <tr key={player.playerId} className={`hover:bg-gray-100 ${player.playerId !== undefined && isHighlighted(player.playerId) ? 'bg-yellow-300' : ''}`}>
                  <td className="border-b p-3">{player.playerName}</td>
                  {isInningSelected === 'second' && (
                    <>
                      <td className="border-b p-3">
                        <button
                          title="Select Batter 1"
                          className={`px-2 py-1 rounded ${isSelected(player.playerId!, 'batter1Id') ? 'bg-red-500 text-white' : 'text-red-500 hover:text-red-700'}`}
                          onClick={() => player.playerId !== undefined && handlePlayerSelection(player.playerId, 'batter1Id')}
                        >
                          Batter 1
                        </button>
                      </td>
                      <td className="border-b p-3">
                        <button
                          title="Select Batter 2"
                          className={`px-2 py-1 rounded ${player.playerId !== undefined && isSelected(player.playerId, 'batter2Id') ? 'bg-red-500 text-white' : 'text-red-500 hover:text-red-700'}`}
                          onClick={() => player.playerId !== undefined && handlePlayerSelection(player.playerId, 'batter2Id')}
                        >
                          Batter 2
                        </button>
                      </td>
                    </>
                  )}
                  {/* Add bowler selection button when inning is not selected for team */}
                  {isInningSelected !== 'second' && (
                    <td className="border-b p-3">
                      <button
                        title="Select Bowler"
                        className={`px-2 py-1 rounded ${isSelected(player.playerId!, 'bowlerId') ? 'bg-green-500 text-white' : 'text-green-500 hover:text-green-700'}`}
                        onClick={() => player.playerId !== undefined && handlePlayerSelection(player.playerId, 'bowlerId')}
                      >
                        Bowler
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleSubmitAllSelections}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Submit Selections
        </button>
      </div>
    </div>
  );

};

export default TeamSquadComponents;
