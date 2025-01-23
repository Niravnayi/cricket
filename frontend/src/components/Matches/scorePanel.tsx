import React, { useEffect, useRef, useState } from "react";
import { MatchDetails, PlayerStats, Scorecard } from "./types/matchDetails";
import socket from "@/utils/socket";

interface ScorePanelProps {
  matchDetails: MatchDetails;
  isOrganizer: boolean;
  fetchMatchDetails: () => void; // Function to refetch match details
}

const ScorePanel: React.FC<ScorePanelProps> = ({
  matchDetails,
  isOrganizer,
  fetchMatchDetails,
}) => {
  const isScorecardCreatedRef = useRef(false); // Tracks if scorecard creation has occurred
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);

  const calculateTeamScores = () => {
    try {
      const { scorecard } = matchDetails;

      if (scorecard && scorecard.battingStats) {
        // Filter players for each team
        const teamAPlayers = scorecard.battingStats.filter(
          (player: PlayerStats) => player.teamName === matchDetails.firstTeamName
        );
        const teamBPlayers = scorecard.battingStats.filter(
          (player: PlayerStats) => player.teamName === matchDetails.secondTeamName
        );

        // Calculate total runs for each team
        const teamARuns = teamAPlayers.reduce((sum, player) => sum + player.runs, 0);
        const teamBRuns = teamBPlayers.reduce((sum, player) => sum + player.runs, 0);

        setTeamAScore(teamARuns);
        setTeamBScore(teamBRuns);
      }
    } catch (error) {
      console.error("Error calculating team scores:", error);
    }
  };

  useEffect(() => {
    const manageScorecard = async () => {
      const matchId = matchDetails.matchId;

      // Check for scorecard creation condition
      if (!matchDetails.scorecard && matchDetails.isLive && !isScorecardCreatedRef.current) {
        // Create the initial scorecard if not already created
        const newScorecard: Scorecard = {
          teamAScore: 0,
          teamBScore: 0,
          teamAWickets: 0,
          teamBWickets: 0,
          teamAOvers: 0,
          teamBOvers: 0,
        };

        // Emit socket event and mark scorecard as created
        socket.emit("createScorecard", { matchId, Scorecard: newScorecard });
        isScorecardCreatedRef.current = true;

        // Fetch updated match details
        fetchMatchDetails();
      }
    };

    if (isOrganizer && matchDetails.isLive) {
      manageScorecard();
    } else {
      // Reset the ref if the match goes offline or a new match is created
      isScorecardCreatedRef.current = false;
    }

    // Calculate scores whenever match details change
    calculateTeamScores();

    // Socket event listeners for real-time updates
    socket.on("scoreUpdate", fetchMatchDetails); // Trigger match details update
    socket.on("battingStatsUpdate", calculateTeamScores); // Recalculate scores on batting stats update

    return () => {
      socket.off("scoreUpdate", fetchMatchDetails);
      socket.off("battingStatsUpdate", calculateTeamScores);
    };
  }, [matchDetails, isOrganizer, fetchMatchDetails]);

  return (
    <div className="grid grid-cols-2 gap-8 p-8 bg-gray-100 rounded-lg shadow-lg">
      {/* First Team Panel */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-blue-900">
          {matchDetails.firstTeamName}
        </h3>
        {matchDetails.isLive ? (
          <div>
            <p className="text-lg font-semibold text-gray-700">
              {teamAScore}/{matchDetails.scorecard?.teamAWickets || 0}
            </p>
            <p className="text-sm text-gray-500">
              Overs: {matchDetails.scorecard?.teamAOvers || 0}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Match has not started yet</p>
        )}
      </div>

      {/* Second Team Panel */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-blue-900">
          {matchDetails.secondTeamName}
        </h3>
        {matchDetails.isLive ? (
          <div>
            <p className="text-lg font-semibold text-gray-700">
              {teamBScore}/{matchDetails.scorecard?.teamBWickets || 0}
            </p>
            <p className="text-sm text-gray-500">
              Overs: {matchDetails.scorecard?.teamBOvers || 0}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Match has not started yet</p>
        )}
      </div>
    </div>
  );
};

export default ScorePanel;
