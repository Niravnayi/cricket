import React, { useEffect, useState } from 'react';
import socket from '@/utils/socket';
import axiosClient from '@/utils/axiosClient';
import { MatchDetails, PlayerStats, BowlingStats, MatchState, Scorecard } from './types/matchDetails';
import { getMatchState } from '@/server-actions/matchStateActions';
import { getBattingStats } from '@/server-actions/battingStatsActions';
import { getBowlingStats } from '@/server-actions/bowlingStatsAction';
import { getScoreCardbyId } from '@/server-actions/scorecardActions';
import { updateMatchState } from '@/server-actions/matchStateActions';

interface BattingStatsComponentProps {
  matchDetails: MatchDetails;
  strikerIndex: number;
  nonStrikerIndex: number;
  onStrikeChange: () => void;
}

const BattingStatsComponent: React.FC<BattingStatsComponentProps> = ({   matchDetails,
  strikerIndex,
  onStrikeChange }) => {
  const [editingPlayer, setEditingPlayer] = useState<PlayerStats | null>(null);
  const [pendingRuns, setPendingRuns] = useState<number>(0);
  const [battingStats, setBattingStats] = useState<PlayerStats[]>([]);
  const [dismissal, setDismissal] = useState<string | null>(null)
  console.log(strikerIndex)
  
  const [matchState, setMatchState] = useState<MatchState | null>(null);

  useEffect(() => {
    async function fetchBattingStats() {
      try {
        const matchId = matchDetails.matchId;
        const response = await axiosClient.get(`/matches/${matchId}`);

        const matchData = response.data;
        if (matchData.scorecard?.battingStats) {
          setBattingStats(matchData.scorecard.battingStats);
        }
        else {
          console.warn('No batting stats found in the fetched match data.');
        }
      } catch (error) {
        console.error('Error fetching initial batting stats:', error);
      }
    }

    fetchBattingStats();

    async function getMatchStats() {

      try {
        if (matchDetails?.scorecard?.battingStats && matchDetails?.scorecard?.bowlingStats && matchDetails?.scorecard?.scorecardId && matchDetails.scorecard.battingStats.length > 0 && matchDetails.scorecard.bowlingStats.length > 0) {
          const response = await getMatchState({ matchId: matchDetails.matchId });
          console.log("get match state",response)
          setMatchState(response);
        }
      }
      catch (error) {
        console.error('Error fetching match state:', error);
      }
    }

    getMatchStats()

    socket.on('fetchMatch', (updatedMatchState: MatchDetails) => {

      if (updatedMatchState.scorecard?.battingStats) {
        setBattingStats((prevStats) => {
          const updatedStats = updatedMatchState.scorecard?.battingStats;
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
    setDismissal(dismissalMethod);
  
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
        const bowlingStatsResponse = await getBowlingStats();
  
        const currentBowlerStats = bowlingStatsResponse.data?.find(
          (bowler: BowlingStats) => bowler.playerId === currentBowlerId
        );
  
        if (currentBowlerStats) {
          const updatedBowlerStats = {
            ...currentBowlerStats,
            teamId,
            wickets: currentBowlerStats.wickets + 1,
          };
  
          await axiosClient.put(`/bowling-stats/${currentBowlerId}`, updatedBowlerStats);
        }
  
        socket.emit('dismissedBatter', { playerId: player.playerId });
        setMatchState((prevState) => {
          if (!prevState) return prevState; // Ensure previous state exists
        
          // Check if any batter needs to be updated
          const isBatter1Out = prevState.batter1Id === player.playerId;
          const isBatter2Out = prevState.batter2Id === player.playerId;
        
          // If neither batter is out, return without changing state
          if (!isBatter1Out && !isBatter2Out) return prevState;
        
          return {
            ...prevState,
            batter1Id: isBatter1Out ? 0 : prevState.batter1Id,
            batter2Id: isBatter2Out ? 0 : prevState.batter2Id,
          };
        });
        
        // Use `useEffect` to trigger API update only when matchState changes
        console.log("Updated matchState:", matchState); 
        
          if (!matchState) return; // Ensure state exists
        
          // **Check if none of the values are zero, then return without updating API**
          if (matchState.batter1Id !== 0 && matchState.batter2Id !== 0) return;
        
          updateMatchState({
            matchId: matchDetails.matchId,
            currentBatter1Id: matchState.batter1Id || 0,
            currentBatter2Id: matchState.batter2Id || 0,
            currentBowlerId: matchState.bowlerId || 0,
          });
        
        
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

        socket.on("teamUpdate", (data: {
          runs: number[];
          overs: number[];
          scorecardId: number[];
          dismissedBatters: string[];
          teamName: string[];
        }) => {
          console.log(data)
          console.log('batting A Stats Listening')
        });

        async function getScoreCard() {
          try {
            if (matchDetails.scorecard?.scorecardId !== undefined) {
              await getScoreCardbyId({ scorecardId: matchDetails.scorecard.scorecardId });
            }
          }
          catch (error) {
            console.error('Error fetching bowling stats:', error);
          }
        }

        getScoreCard()

        socket.on('getScoreCard', (data: { scorecard: Scorecard }) => {
          console.log('all bowling stats')
          console.log(data)
        })

        const currentBowlerId = matchState?.bowlerId;
        const currentScorecardId = matchDetails.scorecard?.scorecardId
        if (currentBowlerId) {
          const bowlingStatsResponse = await axiosClient.get(`/bowling-stats/`);
          const currentBowlerStats = bowlingStatsResponse.data.filter(
            (bowler: BowlingStats) => bowler.playerId === currentBowlerId && bowler.scorecardId === currentScorecardId
          )[0];

          const addedRuns = currentBowlerStats ? pendingRuns + currentBowlerStats.runsConceded : pendingRuns;

          const teamId =
            editingPlayer.teamName === matchDetails.firstTeamName
              ? matchDetails.secondTeamId
              : matchDetails.firstTeamId;

          console.log("current bowler over",currentBowlerStats.overs)
          const currentOvers = currentBowlerStats ? currentBowlerStats.overs : 0;
          const totalBalls = Math.floor(currentOvers) * 6 + (currentOvers % 1) * 10; 
          
          const updatedBallsCount = totalBalls + 1; 
          const updatedOvers = Math.floor(updatedBallsCount / 6) + (updatedBallsCount % 6) * 0.1; 
          const updatedBowlerStats = {
            ...currentBowlerStats,
            runsConceded: addedRuns,
            teamId,
            overs:updatedOvers,
            wickets: currentBowlerStats ? currentBowlerStats.wickets + (dismissal ? 1 : 0) : 0,
            economyRate: parseInt((currentBowlerStats.runsConceded / updatedBallsCount).toFixed(2)),
          };
          console.log("updated bowler stats",updatedBowlerStats)
          await axiosClient.put(`/bowling-stats/${currentBowlerId}`, updatedBowlerStats);

          if (updatedBallsCount >= 6) {
            socket.emit('removeBowlerFromMatchState', currentBowlerId);
          }

          socket.emit('updateBowlingStats', updatedBowlerStats);
          socket.on('updateBowlingStats', () => { });
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
      if (pendingRuns % 2 !== 0) {
  onStrikeChange();
      }      
      return () => {
        socket.off('getScoreCard');
        socket.off('teamUpdate');
      };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
    {['firstTeamName', 'secondTeamName'].map((teamKey) => (
      <div key={teamKey} className="bg-white rounded-lg shadow-lg p-6 transition-all hover:shadow-xl">
        <h3 className="text-2xl font-semibold text-blue-900 mb-6">
          Batting Stats - {matchDetails[teamKey as 'firstTeamName' | 'secondTeamName']}
        </h3>
        <div className="space-y-4">
          {battingStats
            .filter(
              (player) =>
                player.teamName === matchDetails[teamKey as 'firstTeamName' | 'secondTeamName'] &&
                player.dismissal === 'Not Out' &&
                (matchState?.bowlerId === player.playerId ||
                  matchState?.batter1Id === player.playerId ||
                  matchState?.batter2Id === player.playerId)
            )
            .slice(0, 2) // Limit to first 2 players
            .map((player, index) => (
              <div
                key={player.playerName}
                className={`flex justify-between items-center p-4 border-b border-gray-200 ${
                  index === strikerIndex ? 'bg-yellow-100' : ''
                }`}
              >
                <div className="flex flex-col text-left space-y-1">
                  <span className="text-lg font-medium text-gray-800">
                    {player.playerName} {index === strikerIndex ? '(Striker)' : '(Non-Striker)'}
                  </span>
                  <span className="text-sm text-gray-600">
                    {player.runs} runs ({player.balls} balls)
                  </span>
                  <span className="text-sm text-gray-500">
                    SR: {((player.runs / player.balls) * 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-4 items-center">
                {index === strikerIndex && (<button
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-all"
                    onClick={() => handleEditClick(player)}
                  >
                    Edit
                  </button>)}
                
                    <button
                      className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-all"
                      onClick={() => handleDismissedClick(player)}
                    >
                      Dismissed
                    </button>
                  
                </div>
              </div>
            ))}
        </div>
  
        {/* Editing player UI */}
        {editingPlayer &&
          editingPlayer.teamName === matchDetails[teamKey as 'firstTeamName' | 'secondTeamName'] && (
            <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
              <p className="text-sm font-semibold text-gray-800 mb-4">
                Editing <span className="text-blue-700">{editingPlayer.playerName}</span> - Pending Runs:{' '}
                <span className="text-green-700">{pendingRuns}</span>
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((run) => (
                  <button
                    key={run}
                    className="px-4 py-2 bg-green-500 text-white text-xl rounded-lg hover:bg-green-600 transition-all"
                    onClick={() => handleRunClick(run)}
                  >
                    {run}
                  </button>
                ))}
                <button
                  className="col-span-3 px-4 py-2 bg-red-500 text-white text-xl rounded-lg hover:bg-red-600 transition-all"
                  onClick={() => setPendingRuns(0)}
                >
                  Clear
                </button>
              </div>
              <button
                className="mt-6 px-6 py-3 bg-blue-700 text-white text-lg rounded-lg hover:bg-blue-800 transition-all"
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