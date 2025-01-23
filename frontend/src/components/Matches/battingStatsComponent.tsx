import React, { useEffect, useState } from 'react';
import axiosClient from '@/utils/axiosClient';
import socket from '@/utils/socket';
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

  useEffect(() => {
    async function fetchBattingStats() {
      try {
        const matchId = matchDetails.matchId;
  
        // Fetch match state
        const matchState = await getMatchState({ matchId });
        console.log('Match state:', matchState,matchState.batter1Id,matchState.batter2Id);
        
        if (!matchState || !matchState.batter1Id || !matchState.batter2Id) {
          console.warn('Match state does not contain valid batter IDs.');
          return;
        }
  
        // Fetch batting stats
        const battingStateResponse: PlayerStats[] = await getBattingStats();
        console.log('Batting stats:', battingStateResponse);
  
        if (!Array.isArray(battingStateResponse)) {
          console.error('Batting stats response is not an array.');
          return;
        }
  
        // Find the batters by playerId
        const firstBatter = battingStateResponse.find(
          (player) => player.playerId === matchState.batter1Id
        );
        const secondBatter = battingStateResponse.find(
          (player) => player.playerId === matchState.batter2Id
        );
        console.log(firstBatter,secondBatter)
  
        if (firstBatter && secondBatter) {
          setBattingStats([firstBatter, secondBatter]);
        } else {
          console.warn('No matching players found for the given batter IDs.');
        }
      } catch (error) {
        console.error('Error fetching batting stats or match state:', error);
      }
    }
  
    fetchBattingStats();
  
    socket.on('matchStateFetched', (updatedMatchState: MatchDetails) => {
      if (updatedMatchState.scorecard?.battingStats) {
        setBattingStats(updatedMatchState.scorecard.battingStats);
      }
    });
  
    return () => {
      socket.off('matchStateFetched');
    };
  }, [matchDetails]);
  

  const handleEditClick = (player: PlayerStats) => {
    console.log(player,matchDetails.firstTeamId)
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
      console.log(editingPlayer)
      try {
        const response = await axiosClient.put(`/batting-stats/${editingPlayer.battingStatsId}`, {
          scorecardId: editingPlayer.scorecardId,
          playerId: editingPlayer.playerId,
          teamId: matchDetails.firstTeamId,
          runs: updatedRuns,
          balls: updatedBalls,
          fours: editingPlayer.fours,
          sixes: editingPlayer.sixes,
          strikeRate: parseInt(((updatedRuns / updatedBalls) * 100).toFixed(2),),
          dismissal: editingPlayer.dismissal,
        });

        console.log('Updated successfully:', response.data);

        socket.emit('updateMatchState', {
          matchId: matchDetails.matchId,
          battingStats: response.data,
        });

        setEditingPlayer(null);
        setPendingRuns(0);

        // Update batting stats locally
        setBattingStats((prevStats) =>
          prevStats.map((player) =>
            player.battingStatsId === editingPlayer.battingStatsId
              ? { ...player, runs: updatedRuns, balls: updatedBalls }
              : player
          )
        );
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
                  onClick={() => handleEditClick(player)}
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
