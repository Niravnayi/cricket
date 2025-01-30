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
  const [isInningSelected, setIsInningSelected] = useState<'first' | 'second' | null>('first');

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
      if (matchDetails?.matchId) {
        const response = await getMatchState({ matchId: matchDetails.matchId });
        setMatchState(response);
      }
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

  useEffect(() => {
    const fetchMatchState = async () => {
      if (matchDetails?.matchId) {
        try {
          const response = await getMatchState({ matchId: matchDetails.matchId });
          setMatchState(response);
        }
        catch (error) {
          console.log('Error fetching match state:', error);
        }
      }
    };

    fetchMatchState();

  }, [matchDetails?.matchId]);

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
            dismissal: 'Yet to Bat',
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
              dismissal: 'Yet to Bat',
            },
          ];
          await addBattingStats(battingStatsData);
        }
      }

      if (newBowlingStatsData.playerId) {
        if (newBowlingStatsData.isNew) {
          const bowlingStatsData = {
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
          await addBowlingStats({ bowlingStatsData });
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

  const isHighlighted = (playerId: number) => {
    return (
      playerId === matchState?.batter1Id ||
      playerId === matchState?.batter2Id ||
      playerId === matchState?.bowlerId
    );
  };

  return (
    <div className="my-10 px-6">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
        🏏 Team Squads
      </h2>

      {/* Team Selection */}
      <div className="flex justify-center gap-6 mb-6">
        <label className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg shadow-md cursor-pointer transition hover:bg-gray-200">
          <input
            type="checkbox"
            className="hidden"
            checked={isInningSelected === "first"}
            onChange={() =>
              setIsInningSelected(isInningSelected === "first" ? null : "first")
            }
          />
          <span
            className={`w-5 h-5 inline-block rounded-full ${isInningSelected === "first" ? "bg-blue-500" : "bg-gray-300"}`}
          />
          <span className="text-lg font-medium text-gray-700">First Team</span>
        </label>

        <label className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg shadow-md cursor-pointer transition hover:bg-gray-200">
          <input
            type="checkbox"
            className="hidden"
            checked={isInningSelected === "second"}
            onChange={() =>
              setIsInningSelected(isInningSelected === "second" ? null : "second")
            }
          />
          <span
            className={`w-5 h-5 inline-block rounded-full ${isInningSelected === "second" ? "bg-blue-500" : "bg-gray-300"}`}
          />
          <span className="text-lg font-medium text-gray-700">Second Team</span>
        </label>
      </div>

      {/* Teams Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[{ team: firstTeam, name: matchDetails?.firstTeamName, inning: "first" }, { team: secondTeam, name: matchDetails?.secondTeamName, inning: "second" }]
          .map(({ team, name, inning }) => (
            <div key={inning} className="bg-white shadow-xl rounded-lg overflow-hidden">
              <h3 className="text-2xl font-semibold text-center bg-blue-500 text-white py-4">
                {name}
              </h3>
              <table className="w-full border-collapse">
                <tbody>
                  {team.map((player) => {

                    const playerDismissal = player.playerId !== undefined ? Batting?.find(stat => stat.playerId === player.playerId) ?? { dismissal: "Not Out" } : { dismissal: "Not Out" };


                    return (
                      <tr
                        key={player.playerId}
                        className={`transition hover:bg-gray-100 ${player.playerId !== undefined && isHighlighted(player.playerId) ? "bg-yellow-300" : ""}`}
                      >
                        <td className="border-b p-4 text-lg text-gray-700">
                          {player.playerName}
                        </td>

                        {/* Batting or Dismissed Selection */}
                        {isInningSelected === inning ? (
                          playerDismissal.dismissal === "Not Out" ? (
                            <>
                              <td className="border-b p-4">
                                <button
                                  title="Select Batter 1"
                                  className={`px-3 py-1 rounded-md font-medium transition ${player.playerId !== undefined && isSelected(player.playerId, "batter1Id")
                                      ? "bg-red-500 text-white"
                                      : "text-red-500 hover:bg-red-100"
                                    }`}
                                  onClick={() =>
                                    player.playerId !== undefined &&
                                    player.playerId !== playerSelections.batter2Id && 
                                    handlePlayerSelection(player.playerId, "batter1Id")
                                  }
                                >
                                  Batter 1
                                </button>
                              </td>

                              <td className="border-b p-4">
                                <button
                                  title="Select Batter 2"
                                  className={`px-3 py-1 rounded-md font-medium transition ${player.playerId !== undefined && isSelected(player.playerId, "batter2Id")
                                      ? "bg-red-500 text-white"
                                      : "text-red-500 hover:bg-red-100"
                                    }`}
                                  onClick={() =>
                                    player.playerId !== undefined &&
                                    player.playerId !== playerSelections.batter1Id && 
                                    handlePlayerSelection(player.playerId, "batter2Id")
                                  }
                                >
                                  Batter 2
                                </button>
                              </td>

                            </>
                          ) : (
                            <td className="border-b p-4">
                              <button
                                title="Dismissed"
                                className="px-3 py-1 rounded-md font-medium text-gray-500 cursor-not-allowed"
                                disabled
                              >
                                {playerDismissal.dismissal}
                              </button>
                            </td>
                          )
                        ) : (
                          <td className="border-b p-4">
                            <button
                              title="Select Bowler"
                              className={`px-3 py-1 rounded-md font-medium transition ${player.playerId !== undefined && isSelected(player.playerId, "bowlerId")
                                ? "bg-green-500 text-white"
                                : "text-green-500 hover:bg-green-100"
                                }`}
                              onClick={() =>
                                player.playerId !== undefined &&
                                handlePlayerSelection(player.playerId, "bowlerId")
                              }
                            >
                              Bowler
                            </button>
                          </td>
                        )}

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
      </div>

      {/* Submit Button */}
      <div className="mt-10 text-center">
        <button
          onClick={handleSubmitAllSelections}
          className="bg-blue-600 text-white text-lg font-medium px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition"
        >
          ✅ Submit Selections
        </button>
      </div>
    </div>


  );


};

export default TeamSquadComponents;
