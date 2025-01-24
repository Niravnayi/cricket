import React, { useEffect, useState } from 'react';
import socket from '@/utils/socket';
import axiosClient from '@/utils/axiosClient';
import { MatchDetails } from './types/matchDetails';
import { getBattingStats } from '@/server-actions/matchesActions';
import { BattingStats } from '@/app/matches/types';

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

  // Fetch initial data for batting stats
  useEffect(() => {
    async function fetchBattingStats() {
      try {
        const matchId = matchDetails.matchId;

        // Fetch match details, including batting stats
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

    // Listen for real-time updates via socket
    socket.on('fetchMatch', (updatedMatchState: MatchDetails) => {
      console.log('Real-time match update received:', updatedMatchState);

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

  const handleSaveClick = async () => {
    if (editingPlayer) {
      const updatedRuns = editingPlayer.runs + pendingRuns;
      const updatedBalls = editingPlayer.balls + 1;

      try {
        const response = await axiosClient.put(`/batting-stats/${editingPlayer.battingStatsId}`, {
          scorecardId: editingPlayer.scorecardId,
          playerId: editingPlayer.playerId,
          teamId: matchDetails.firstTeamId,
          runs: updatedRuns,
          balls: updatedBalls,
          fours: editingPlayer.fours,
          sixes: editingPlayer.sixes,
          strikeRate: parseInt(((updatedRuns / updatedBalls) * 100).toFixed(2)),
          dismissal: editingPlayer.dismissal,
        });

        console.log('Updated successfully:', response.data);

        async function getBatting(){
            const response = await getBattingStats()
            console.log(response)
        }
        getBatting()

        socket.on("teamAUpdate", async (data: { runs: number[]; overs: number[] }) => {
          console.log("Real-time data received:", data);
      console.log('data change recieved')
      });
      
      
      socket.on("allBattingStats", async (battingStats:BattingStats[]) => {
        console.log("Real-time data received:", battingStats);
    console.log('data change recieved')
    });
    socket.on("allDismissedStats", async (battingStats:BattingStats[]) => {
      console.log("Real-time data received:", battingStats);
  console.log('data change recieved')
  });

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
  console.error('Error updating batting stats:', error);
}

    return () => {
        socket.off("teamAUpdate");
        socket.off("allBattingStats");
        socket.off("allDismissedStats");
    };
    }
  };
  const handleDismissedClick = async (player: PlayerStats) => {
    const dismissalMethod = prompt(`Enter the dismissal method for ${player.playerName}:`, "Caught, Bowled, etc.");
    if (dismissalMethod) {
      try {
        const response = await axiosClient.put(`/batting-stats/${player.battingStatsId}`, {
          ...player,
          dismissal: dismissalMethod,
          teamId:matchDetails.firstTeamId
        });
        await getBattingStats()
        console.log('Dismissal updated successfully:', response.data);

        socket.on('dismissedBatter',(data:{dismissedBatter:string[]})=>{
          console.log('Dismissed batter received:', data);
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
