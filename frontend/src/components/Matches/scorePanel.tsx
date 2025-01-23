import React, { useEffect, useRef } from "react";
import { MatchDetails, Scorecard } from "./types/matchDetails";
import { setScoreCard } from "@/server-actions/matchesActions";
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

  useEffect(() => {
    const manageScorecard = async () => {
      const matchId = matchDetails.matchId;

      // Check for scorecard creation condition
      if (!matchDetails.scorecard && matchDetails.isLive && !isScorecardCreatedRef.current) {
        // Create the initial scorecard
        const newScorecard: Scorecard = {
          teamAScore: 0,
          teamBScore: 0,
          teamAWickets: 0,
          teamBWickets: 0,
          teamAOvers: 0,
          teamBOvers: 0,
        };

        // Emit socket event and update the backend
        socket.emit("createScorecard", { matchId, Scorecard: newScorecard });
        await setScoreCard({ matchId, Scorecard: newScorecard });

        // Mark the scorecard as created
        isScorecardCreatedRef.current = true;

        // Fetch updated match details
        fetchMatchDetails();
      }
    };

    if (isOrganizer && matchDetails.isLive) {
      manageScorecard();
    } else {
      // Reset the ref if the match goes offline or when a new match is created
      isScorecardCreatedRef.current = false;
    }

    // Socket event listeners for real-time updates
    socket.on("scoreCreate", fetchMatchDetails);

    return () => {
      socket.off("scoreCreate", fetchMatchDetails);
    };
  }, [matchDetails, isOrganizer, fetchMatchDetails]);

  return (
    <div className="grid grid-cols-2 gap-8 p-8 bg-gray-100 rounded-lg shadow-lg">
      {/* First Team Panel */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-blue-900">
          {matchDetails.firstTeamName}
        </h3>
        {matchDetails.scorecard && matchDetails.isLive ? (
          <div>
            <p className="text-lg font-semibold text-gray-700">
              {matchDetails.scorecard.teamAScore}/{matchDetails.scorecard.teamAWickets}
            </p>
            <p className="text-sm text-gray-500">
              Overs: {matchDetails.scorecard.teamAOvers}
            </p>
          </div>
        ) : (
          <>
            {!matchDetails.isLive ? (
              <p className="text-sm text-gray-500">Match has not started yet</p>
            ) : (
              <p className="text-sm text-gray-500"></p>
            )}
          </>
        )}
      </div>

      {/* Second Team Panel */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-blue-900">
          {matchDetails.secondTeamName}
        </h3>
        {matchDetails.scorecard && matchDetails.isLive ? (
          <div>
            <p className="text-lg font-semibold text-gray-700">
              {matchDetails.scorecard.teamBScore}/{matchDetails.scorecard.teamBWickets}
            </p>
            <p className="text-sm text-gray-500">
              Overs: {matchDetails.scorecard.teamBOvers}
            </p>
          </div>
        ) : (
          <>
            {!matchDetails.isLive ? (
              <p className="text-sm text-gray-500">Match has not started yet</p>
            ) : (
              <p className="text-sm text-gray-500"></p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ScorePanel;
