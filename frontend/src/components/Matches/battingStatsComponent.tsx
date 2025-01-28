import React, { useEffect, useState } from 'react';
import socket from '@/utils/socket';
import axiosClient from '@/utils/axiosClient';
import { MatchDetails } from './types/matchDetails';
import { getBattingStats, getMatchState, getBowlingStats } from '@/server-actions/matchesActions';
import { BowlingStats } from '@/app/matches/types';

interface PlayerStats {
  dismissal: string;
  sixes: number;
  fours: number;
  teamId: number;
  playerId: number;
  scorecardId: number;
  playerName: string;
  teamName: string;
  battingStatsId: number;
  runs: number;
  balls: number;
  id: number;
}

interface BattingStatsComponentProps {
  matchDetails: MatchDetails;
}

const BattingStatsComponent: React.FC<BattingStatsComponentProps> = ({ matchDetails }) => {
  const [editingPlayer, setEditingPlayer] = useState<PlayerStats | null>(null);
  const [pendingRuns, setPendingRuns] = useState<number>(0);
  const [battingStats, setBattingStats] = useState<PlayerStats[]>([]);
  const [dismissal, setDismissal] = useState<string | null>(null)
  interface MatchState {
    bowlerId: number;
    // Add other properties of matchState if needed
  }

  const [matchState, setMatchState] = useState<MatchState | null>(null);

  // Fetch initial data for batting stats
  useEffect(() => {
    async function fetchBattingStats() {
      try {
        const matchId = matchDetails.matchId;
        const response = await axiosClient.get(`/matches/${matchId}`);
        const matchData = response.data;
        if (matchData.scorecard?.battingStats) {
          setBattingStats(matchData.scorecard.battingStats);
        } else {
          console.warn('No batting stats found in the fetched match data.');
        }
      } catch (error) {
        console.error('Error fetching initial batting stats:', error);
      }
    }

    fetchBattingStats();



    async function getMatchStats() {
      try {
        const response = await getMatchState({ matchId: matchDetails.matchId })
        setMatchState(response)
      } catch (error) {
        console.error('Error fetching match state:', error);
      }
    }

    getMatchStats()





    // Listen for real-time updates via socket
    socket.on('fetchMatch', (updatedMatchState: MatchDetails) => {

      if (updatedMatchState.scorecard?.battingStats) {
        setBattingStats((prevStats) => {
          const updatedStats = updatedMatchState.scorecard?.battingStats;

          // Merge real-time data with the current state
          return prevStats.map((player) => {
            const updatedPlayer = updatedStats?.find(
              (updated) => updated.battingStatsId === player.battingStatsId
            );
            return updatedPlayer ? { ...player, ...updatedPlayer } : player;
          });
        });
      }
    });

    return () => {
      socket.off('fetchMatch');
    };
  }, [matchDetails]);

  const handleEditClick = (player: PlayerStats) => {
    setEditingPlayer(player);
    setPendingRuns(0);
  };

  const handleRunClick = (runs: number) => {
    if (editingPlayer) {
      setPendingRuns(pendingRuns + runs);
    }
  };
  const handleDismissedClick = async (player: PlayerStats) => {
    const dismissalMethod = prompt(`Enter the dismissal method for ${player.playerName}:`, "Caught, Bowled, etc.");
    setDismissal(dismissalMethod)
    if (dismissalMethod) {
      try {
        const teamId = player.teamName === matchDetails.firstTeamName
        ? matchDetails.firstTeamId
        : matchDetails.secondTeamId;
        await axiosClient.put(`/batting-stats/${player.battingStatsId}`, {
          ...player,
          dismissal: dismissalMethod,
          teamId,
        });
        
        
        const currentBowlerId = matchState?.bowlerId;
        const bowlingStatsResponse = await axiosClient.get(`/bowling-stats/`);
        const currentBowlerStats = bowlingStatsResponse.data.filter((bowler: BowlingStats) => bowler.playerId === currentBowlerId)[0];
        const teamId1 = currentBowlerStats.teamName === matchDetails.firstTeamName
        ? matchDetails.firstTeamId
        : matchDetails.secondTeamId;
        const updatedBowlerStats = {
          ...currentBowlerStats,
          teamId1,
          wickets: currentBowlerStats ? currentBowlerStats.wickets + (!dismissalMethod ? 0 : 1) : 0, // Increment wickets if batsman is dismissed
        };
        await axiosClient.put(`/bowling-stats/${currentBowlerId}`, updatedBowlerStats);
        socket.on('dismissedBatter', () => {
        })

        setBattingStats((prevStats) =>
          prevStats.map((p) =>
            p.battingStatsId === player.battingStatsId
              ? { ...p, dismissal: dismissalMethod }
              : p
          )
        );

        return () => {
          socket.off('dismissedBatter');
        };
      } catch (error) {
        console.error('Error updating dismissal:', error);
      }
    }
  };
  const handleSaveClick = async () => {

    if (editingPlayer) {
      const updatedRuns = editingPlayer.runs + pendingRuns;
      const teamId = editingPlayer.teamName === matchDetails.firstTeamName
      ? matchDetails.firstTeamId
      : matchDetails.secondTeamId;
      const updatedBalls = editingPlayer.balls + 1; 
      try {
        await axiosClient.put(`/batting-stats/${editingPlayer.battingStatsId}`, {
          scorecardId: editingPlayer.scorecardId,
          playerId: editingPlayer.playerId,
          teamId,
          runs: updatedRuns,
          balls: updatedBalls,
          fours: editingPlayer.fours,
          sixes: editingPlayer.sixes,
          strikeRate: parseInt(((updatedRuns / updatedBalls) * 100).toFixed(2)),
          dismissal: editingPlayer.dismissal,
        });
        await getBattingStats()
        socket.on("teamAUpdate", (data: { runs: number[]; overs: number[]; scorecardId: number }) => {
          console.log('batting A Stats Listening')
        });
        socket.on("teamBUpdate", (data: { runs: number[]; overs: number[]; scorecardId: number }) => {
          console.log('batting B Stats Listening')
        });
        async function getBowling() {
          try {
            await getBowlingStats()
          }
          catch (error) {
            console.error('Error fetching bowling stats:', error);
          }
        }
        getBowling()

        socket.on('allBowlingStats', (data: { bowlingStats: BowlingStats[] }) => {
          console.log(data)
        })

        const currentBowlerId = matchState?.bowlerId;
        if (currentBowlerId) {
          const bowlingStatsResponse = await axiosClient.get(`/bowling-stats/`);
          const currentBowlerStats = bowlingStatsResponse.data.filter((bowler: BowlingStats) => bowler.playerId === currentBowlerId)[0];
          const addedRuns = currentBowlerStats ? pendingRuns + currentBowlerStats.runsConceded : pendingRuns;
          console.log(updatedBalls)
          const updatedBowlerStats = {
            ...currentBowlerStats,
            runsConceded: addedRuns,
            teamId: matchDetails.secondTeamId,
            overs: parseInt(`${Math.floor(updatedBalls / 6)}.${updatedBalls % 6}`),
            wickets: currentBowlerStats ? currentBowlerStats.wickets + (!dismissal ? 0 : 1) : 0,
            economyRate: parseInt((currentBowlerStats.runsConceded / updatedBalls).toFixed(2)),
          };

          await axiosClient.put(`/bowling-stats/${currentBowlerId}`, updatedBowlerStats);

          socket.emit('updateBowlingStats', updatedBowlerStats);

          socket.on('updateBowlingStats', () => {
          });
        }

        setBattingStats((prevStats) =>
          prevStats.map((player) =>
            player.battingStatsId === editingPlayer.battingStatsId
              ? { ...player, runs: updatedRuns, balls: updatedBalls }
              : player
          )
        );

        setEditingPlayer(null);
        setPendingRuns(0);

      } catch (error) {
        console.error('Error updating batting stats or bowling stats:', error);
      }
      return () => {
        socket.off('allBowlingStats');
        socket.off('teamAUpdate');
        socket.off('teamBUpdate');
      };
    }
  };



  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      {['firstTeamName', 'secondTeamName'].map((teamKey) => (
        <div key={teamKey} className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Batting Stats - {matchDetails[teamKey as 'firstTeamName' | 'secondTeamName']}
          </h3>
          {battingStats
            .filter(
              (player) =>
                player.teamName === matchDetails[teamKey as 'firstTeamName' | 'secondTeamName'] &&
                player.dismissal === 'Not Out'
            )
            .map((player) => (
              <div key={player.playerName} className="flex justify-between items-center mb-4">
                <span className="text-gray-800 font-medium">{player.playerName}</span>
                <span className="text-gray-600">
                  {player.runs} runs ({player.balls} balls)
                </span>
                <span className="text-gray-500">
                  SR: {((player.runs / player.balls) * 100).toFixed(2)}
                </span>
                <button
                  className="ml-4 px-3 py-1 bg-blue-500 text-white text-sm rounded"
                  onClick={() => handleEditClick(player)}
                >
                  Edit
                </button>
                <button
                  className="ml-4 px-3 py-1 bg-red-500 text-white text-sm rounded"
                  onClick={() => handleDismissedClick(player)}
                >
                  Dismissed
                </button>
              </div>
            ))}
          {/* Editing player UI remains unchanged */}
          {editingPlayer && editingPlayer.teamName === matchDetails[teamKey as 'firstTeamName' | 'secondTeamName'] && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
              <p className="text-sm font-semibold mb-3">
                Editing <span className="text-blue-700">{editingPlayer.playerName}</span> - Pending Runs: <span className="text-green-700">{pendingRuns}</span>
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map((run) => (
                  <button
                    key={run}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    onClick={() => handleRunClick(run)}
                  >
                    {run}
                  </button>
                ))}
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  onClick={() => setPendingRuns(0)}
                >
                  Clear
                </button>
              </div>
              <button
                className="mt-4 px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
                onClick={handleSaveClick}
              >
                Save
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BattingStatsComponent;
