import React, { useEffect, useState } from 'react';
import { fetchMatchById, fetchTeamPlayers, updateMatchState } from '../../server-actions/matchesActions';
import { Team } from './types/matchDetails';
import { MatchDetails } from './types/matchDetails';
import { addBattingStats } from '../../server-actions/matchesActions'; // Import the addBattingStats function

interface MatchPageProps {
  id: number;
}

const TeamSquadComponents = ({ id }: MatchPageProps) => {
  const [matchDetails, setMatchDetails] = useState<MatchDetails>();
  const [firstTeam, setFirstTeam] = useState<Team[]>([]);
  const [secondTeam, setSecondTeam] = useState<Team[]>([]);
  const [playerSelections, setPlayerSelections] = useState({
    currentBatter1: null as number | null,
    currentBatter2: null as number | null,
    currentBowler: null as number | null,
  });

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
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handlePlayerSelection = (playerId: number, role: 'currentBatter1' | 'currentBatter2' | 'currentBowler') => {
    setPlayerSelections((prevSelections) => ({
      ...prevSelections,
      [role]: playerId,
    }));
  };

  const handleSubmitAllSelections = async () => {
    if (!matchDetails?.matchId) return;

    // Prepare the batting stats data
    const battingStatsData = [
      {
        scorecardId: matchDetails.scorecard?.scorecardId,
        playerId: playerSelections.currentBatter1 ?? 0, // Default to 0 if no batter selected
        teamId: 1, // Assuming 1 for first team, modify accordingly
        playerName: firstTeam.find(player => player.playerId === playerSelections.currentBatter1)?.playerName || '',
        teamName: matchDetails.firstTeamName ?? '',
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        strikeRate: 0,
        dismissal: "Not Out",
      },
      {
        scorecardId: matchDetails.scorecard?.scorecardId,
        playerId: playerSelections.currentBatter2 ?? 0,
        teamId: 1, // Assuming 1 for first team, modify accordingly
        teamName: matchDetails.firstTeamName ?? '',
        playerName: firstTeam.find(player => player.playerId === playerSelections.currentBatter2)?.playerName || '',
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        strikeRate: 0,
        dismissal: "Not Out",
      },
    ];

    try {
      // Send the batting stats to the API
      for (const stats of battingStatsData) {
        const response = await addBattingStats(stats);
        console.log('Batting stats created:', response);
      }

      // Now update the match state
      const matchState = {
        matchId: matchDetails.matchId,
        currentBatter1Id: playerSelections.currentBatter1 ?? 0,
        currentBatter2Id: playerSelections.currentBatter2 ?? 0,
        currentBowlerId: playerSelections.currentBowler ?? 0,
      };

      // Update match state after successful batting stats creation
      console.log(matchState)
      await updateMatchState(matchState);
      console.log('Match state updated:', matchState);

    } catch (error) {
      console.log('Error submitting batting stats or updating match state:', error);
    }
  };

  const isSelected = (playerId: number, role: 'currentBatter1' | 'currentBatter2' | 'currentBowler') => {
    return playerSelections[role] === playerId;
  };

  if (!matchDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-8 px-6">
      <h2 className="text-3xl font-semibold text-center mb-6">Team Squads</h2>
      <div className="flex space-x-12 justify-center">
        {/* First Team */}
        <div className="flex-1 bg-white shadow-lg rounded-lg overflow-hidden">
          <h3 className="text-2xl font-semibold text-center bg-gray-100 py-3">{matchDetails.firstTeamName}</h3>
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <tbody>
              {firstTeam.map((player) => (
                <tr key={player.playerId} className="hover:bg-gray-100">
                  <td className="border-b p-3">{player.playerName}</td>
                  <td className="border-b p-3">
                    <button
                      title="Select Batter 1"
                      className={`px-2 py-1 rounded ${isSelected(player.playerId!, 'currentBatter1') ? 'bg-blue-500 text-white' : 'text-blue-500 hover:text-blue-700'}`}
                      onClick={() => handlePlayerSelection(player.playerId!, 'currentBatter1')}
                    >
                      Batter 1
                    </button>
                  </td>
                  <td className="border-b p-3">
                    <button
                      title="Select Batter 2"
                      className={`px-2 py-1 rounded ${isSelected(player.playerId!, 'currentBatter2') ? 'bg-green-500 text-white' : 'text-green-500 hover:text-green-700'}`}
                      onClick={() => handlePlayerSelection(player.playerId!, 'currentBatter2')}
                    >
                      Batter 2
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Second Team */}
        <div className="flex-1 bg-white shadow-lg rounded-lg overflow-hidden">
          <h3 className="text-2xl font-semibold text-center bg-gray-100 py-3">{matchDetails.secondTeamName}</h3>
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <tbody>
              {secondTeam.map((player) => (
                <tr key={player.playerId} className="hover:bg-gray-100">
                  <td className="border-b p-3">{player.playerName}</td>
                  <td className="border-b p-3">
                    <button
                      title="Select Bowler"
                      className={`px-2 py-1 rounded ${isSelected(player.playerId!, 'currentBowler') ? 'bg-red-500 text-white' : 'text-red-500 hover:text-red-700'}`}
                      onClick={() => handlePlayerSelection(player.playerId!, 'currentBowler')}
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

      {/* Submit Selections */}
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
