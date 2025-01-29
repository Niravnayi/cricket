import React, { useEffect, useRef, useState } from "react";
import { MatchDetails, Scorecard} from "./types/matchDetails";
import socket from "@/utils/socket";
import { getBattingStats } from "@/server-actions/battingStatsActions";
import { getScoreCardbyId, updateScoreCard } from "@/server-actions/scorecardActions";

interface ScorePanelProps {
  matchDetails: MatchDetails;
  isOrganizer: boolean;
  fetchMatchDetails: () => void;
}

const ScorePanel: React.FC<ScorePanelProps> = ({
  matchDetails,
  isOrganizer,
  fetchMatchDetails,
}) => {
  const isScorecardCreatedRef = useRef(false);
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamAovers, setTeamAovers] = useState("0");
  const [teamAWickets] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);
  const [teamBovers, setTeamBovers] = useState("0");
  const [teamBWickets] = useState(0);
  const [scoreCard,setScoreCard] = useState<Scorecard>();
  const [loading, setLoading] = useState(true); // Loading state to handle initial data

  const calculateOvers = (balls: number) => {
    return `${Math.floor(balls / 6)}.${balls % 6}`;
  };

  useEffect(() => {
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

        socket.emit("createScorecard", { matchId, Scorecard: newScorecard });
        isScorecardCreatedRef.current = true;
        fetchMatchDetails();
      }
    };

    manageScorecard();

    const fetchBattingStats = async () => {
      const stats = await getBattingStats();
      console.log(stats);
    };
    fetchBattingStats();

    socket.on(
      "teamUpdate",
      (data: {
        runs: number[];
        overs: number[];
        scorecardId: number[];
        dismissedBatters: string[];
        teamName: string[];
      }) => {
        if (
          matchDetails.scorecard?.scorecardId &&
          data.scorecardId.includes(matchDetails.scorecard?.scorecardId)
        ) {
          let teamATotalRuns = 0;
          let teamATotalBalls = 0;
          let teamBTotalRuns = 0;
          let teamBTotalBalls = 0;
          console.log(data.scorecardId,matchDetails.scorecard?.scorecardId);
          data.teamName.forEach((team, index) => {
            
            if (team === matchDetails.firstTeamName && data.scorecardId[index] === matchDetails.scorecard?.scorecardId) {
              console.log(matchDetails.scorecard?.scorecardId)
              teamATotalRuns += data.runs[index];
              teamATotalBalls += data.overs[index];
            } else if (team === matchDetails.secondTeamName && data.scorecardId[index] === matchDetails.scorecard?.scorecardId) {
              console.log(matchDetails.scorecard?.scorecardId)
              teamBTotalRuns += data.runs[index];
              teamBTotalBalls += data.overs[index];
            }
          });

          // Set loading to false after data arrives
          setLoading(false);

          setTeamAScore(teamATotalRuns);
          setTeamAovers(calculateOvers(teamATotalBalls));
          setTeamBScore(teamBTotalRuns);
          setTeamBovers(calculateOvers(teamBTotalBalls));
        }
      }
    );

    return () => {
      socket.off("teamUpdate");
    };
  }, [matchDetails, isOrganizer, fetchMatchDetails]);

  const updateScorecard = async () => {
    const scorecardId = matchDetails.scorecard?.scorecardId;

    if (scorecardId !== undefined) {
      const Scorecard = {
        teamAScore,
        teamBScore,
        teamAWickets,
        teamBWickets,
        teamAOvers: parseFloat(teamAovers),
        teamBOvers: parseFloat(teamBovers),
      };
      console.log(Scorecard);
      await updateScoreCard({ scorecardId, Scorecard });
    }
  };

  console.log( matchDetails.scorecard?.scorecardId)
  const fetchScoreCard = async () => {
    if (matchDetails.scorecard?.scorecardId !== undefined) {
      const response = await getScoreCardbyId({ scorecardId: matchDetails.scorecard.scorecardId });
      console.log(response)
      setScoreCard(response);
    }
  };

  useEffect(() => {
    if (matchDetails.isLive) {
      updateScorecard();
      fetchScoreCard();
    }
  }, [teamAScore, teamAovers, teamAWickets, teamBScore, teamBovers, teamBWickets]);
console.log(scoreCard)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-gradient-to-r from-blue-50 to-gray-100 rounded-lg shadow-xl">
      {/* First Team Panel */}
      <div className="bg-white rounded-lg shadow-lg p-6 text-center transition-all transform hover:scale-105 hover:shadow-2xl duration-300">
        <h3 className="text-2xl font-semibold text-blue-900 mb-4">{matchDetails.firstTeamName}</h3>
        {loading ? (
          <p className="text-xl font-medium text-gray-700 animate-pulse">Loading...</p>
        ) : (
          <div>
            <p className="text-3xl font-bold text-gray-800 transition-all duration-500 ease-in-out">
              {scoreCard?.teamAScore}/{scoreCard?.teamAWickets}
            </p>
            <p className="text-md text-gray-500 transition-all duration-500 ease-in-out">Overs: {scoreCard?.teamAOvers}</p>
          </div>
        )}
      </div>
  
      {/* Second Team Panel */}
      <div className="bg-white rounded-lg shadow-lg p-6 text-center transition-all transform hover:scale-105 hover:shadow-2xl duration-300">
        <h3 className="text-2xl font-semibold text-blue-900 mb-4">{matchDetails.secondTeamName}</h3>
        {loading ? (
          <p className="text-xl font-medium text-gray-700 animate-pulse">Loading...</p>
        ) : (
          <div>
            <p className="text-3xl font-bold text-gray-800 transition-all duration-500 ease-in-out">
              {scoreCard?.teamBScore}/{scoreCard?.teamBWickets}
            </p>
            <p className="text-md text-gray-500 transition-all duration-500 ease-in-out">Overs: {scoreCard?.teamBOvers}</p>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default ScorePanel;
