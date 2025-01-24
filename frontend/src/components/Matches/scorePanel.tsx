import React, { useEffect, useRef, useState } from "react";
import { MatchDetails } from "./types/matchDetails";
import { getBattingStats } from "@/server-actions/matchesActions";
import socket from "@/utils/socket";
import { BattingStats } from "@/app/matches/types";

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
  const [teamAovers, setTeamAovers] = useState("0");

  const calculateOvers = (balls: number) => {
    return `${Math.floor(balls / 6)}.${balls % 6}`;
  };
  useEffect(() => {
    console.log('this is socket')
    const manageScorecard = async () => {
      const matchId = matchDetails.matchId;
  
      if (!matchDetails.scorecard && matchDetails.isLive && !isScorecardCreatedRef.current) {
        const newScorecard = {
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
    // Socket event listener for real-time updates to teamA stats
    console.log('this is second socket')
async function getBatting(){
    const response = await getBattingStats()
    console.log(response)
}
getBatting()
    socket.on("teamAUpdate", (data: { runs: number[]; overs: number[] }) => {
      console.log('listening socket')
      const totalRuns = data.runs.reduce((sum, run) => sum + run, 0);
      const totalBalls = data.overs.reduce((sum, ball) => sum + ball, 0);
      console.log(totalRuns);
      console.log('updating teams')
      setTeamAScore(totalRuns);
      setTeamAovers(calculateOvers(totalBalls));
    });
  
    // Socket event listener for real-time updates on batting stats (updated in BattingStatsComponent)
    socket.on("updatedBattingStats", (updatedStats: BattingStats) => {
      if (updatedStats.matchId === matchDetails.matchId) {
        // Handle the real-time batting stats update
        console.log('Updated batting stats received in ScorePanel:', updatedStats);
        fetchMatchDetails();  // Re-fetch match details to ensure UI is updated
      }
    });
  
    return () => {
      socket.off("teamAUpdate");
      socket.off("updateBattingStats"); // Ensure cleanup of the listener
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
            <p className="text-sm text-gray-500">Overs: {teamAovers || 0}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Match has not started yet</p>
        )}
      </div>

      {/* Second Team Panel (Placeholder for consistency) */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-blue-900">
          {matchDetails.secondTeamName}
        </h3>
        <p className="text-sm text-gray-500">Match details will be updated...</p>
      </div>
    </div>
  );
};

export default ScorePanel;
