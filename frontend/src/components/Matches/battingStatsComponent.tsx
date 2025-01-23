import React, {  useEffect, useState } from 'react';
import axiosClient from '@/utils/axiosClient';
import socket from '@/utils/socket'; // Import socket
import { getMatchState, getBattingStats } from '@/server-actions/matchesActions';
import { MatchDetails } from './types/matchDetails';
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
  // const [firstBatter,setFirstBatter] = useState<PlayerStats>()
  // const [secondBatter,setSecondBatter] = useState<PlayerStats>()

  useEffect(() => {
    async function getTeamState() {
      console.log(matchDetails.matchId)
      const matchId = matchDetails.matchId

      const response = await getMatchState({ matchId })
      console.log(response)

      const battingStateResponse = await getBattingStats()
      console.log(battingStateResponse)

      const firstBatter = battingStateResponse.find((playerId: number) => playerId === response.Batter2Id);
      const secondBatter = battingStateResponse.find((playerId: number) => playerId === response.Batter2Id);
      console.log(secondBatter,firstBatter)
      if (firstBatter && secondBatter) {
        setBattingStats([firstBatter, secondBatter])
      }
      console.log(battingStats)
    }
    getTeamState()
    socket.on('matchStateFetched', (updatedMatchState: MatchDetails) => {
      if (updatedMatchState.scorecard?.battingStats) {
        // setBattingStats(updatedMatchState.battingStats);
      }
    });
    console.log(battingStats)
    return () => {
      socket.off('matchStateUpdate'); // Clean up on component unmount
    };
  }, []);




  const handleEditClick = (player: PlayerStats) => {
    setEditingPlayer(player);
    setPendingRuns(0);
  };

  const handleRunClick = (runs: number) => {
    if (editingPlayer) {
      setPendingRuns(pendingRuns + runs);
    }
  };
  console.log(battingStats)
  const handleSaveClick = async () => {
    if (editingPlayer) {
      if (!editingPlayer.battingStatsId) {
        console.error('Batting stats ID is undefined. Cannot update stats.');
        return;
      }

      const updatedRuns = editingPlayer.runs + pendingRuns;
      const updatedBalls = editingPlayer.balls + 1;

      try {
        const response = await axiosClient.put(`/batting-stats/${editingPlayer.battingStatsId}`, {
          scorecardId: editingPlayer.scorecardId,
          playerId: editingPlayer.playerId,
          teamId: editingPlayer.teamId,
          runs: updatedRuns,
          balls: updatedBalls,
          fours: editingPlayer.fours,
          sixes: editingPlayer.sixes,
          strikeRate: ((updatedRuns / updatedBalls) * 100).toFixed(2),
          dismissal: editingPlayer.dismissal,
        });

        console.log('Updated successfully', response.data);

        // Emit the updated match state to the server so other clients can listen
        socket.emit('updateMatchState', {
          matchId: matchDetails.matchId,
          battingStats: response.data, // Assuming the server sends back updated batting stats
        });

        setEditingPlayer(null);
      } catch (error) {
        console.error('Error updating batting stats:', error);
      }
    } else {
      console.error('No player is currently being edited.');
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      {['firstTeamName', 'secondTeamName'].map((teamKey) => (
        <div key={teamKey}>
          <h3 className="text-lg font-semibold text-blue-900">
            Batting Stats - {matchDetails[teamKey as 'firstTeamName' | 'secondTeamName']}
          </h3>
          {battingStats
            .filter((player) => player.teamName === matchDetails[teamKey as 'firstTeamName' | 'secondTeamName'])
            .map((player) => (
              <div key={player.playerName} className="flex justify-between text-sm text-gray-600">
                <span>{player.playerName}</span>
                <span>
                  {player.runs} runs ({player.balls} balls)
                </span>
                <span>SR: {(player.runs / player.balls) * 100}</span>
                <button
                  className="ml-2 px-2 py-1 text-white bg-blue-500 rounded"
                  onClick={() => handleEditClick({ ...player, id: player.battingStatsId })}
                >
                  Edit
                </button>
              </div>
            ))}
          {editingPlayer && editingPlayer.teamName === matchDetails[teamKey as 'firstTeamName' | 'secondTeamName'] && (
            <div className="mt-4">
              <p>Editing {editingPlayer.playerName} - Pending Runs: {pendingRuns}</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map((run) => (
                  <button
                    key={run}
                    className="px-2 py-1 bg-green-500 text-white rounded"
                    onClick={() => handleRunClick(run)}
                  >
                    {run}
                  </button>
                ))}
              </div>
              <button
                className="mt-2 px-4 py-1 bg-blue-700 text-white rounded"
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
