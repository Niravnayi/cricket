import React, { useEffect, useRef, useState } from "react";
import { MatchDetails, Scorecard } from "./types/matchDetails";
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
  const [scorecardId, setScorecardId] = useState<Scorecard | undefined>(undefined);

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

    manageScorecard()


    const fetchBattingStats = async () => {
      const stats = await getBattingStats();
      console.log(stats);
    };
    fetchBattingStats();
    socket.on("teamAUpdate", (data: { runs: number[]; overs: number[]; scorecardId: number[] }) => {
      console.log('team A Score Panel Socket')
      if (matchDetails.scorecard?.scorecardId && data.scorecardId.includes(matchDetails.scorecard?.scorecardId)) {
        const totalRuns = data.runs.reduce((sum, run) => sum + run, 0);
        const totalBalls = data.overs.reduce((sum, ball) => sum + ball, 0);
        console.log('set data', data.runs)
        setTeamAScore(totalRuns);
        setTeamAovers(calculateOvers(totalBalls));
      }
    });

    socket.on("teamBUpdate", (data: { runs: number[]; overs: number[]; scorecardId: number[] }) => {
      console.log('team B Score Panel Socket')
      if (matchDetails.scorecard?.scorecardId && data.scorecardId.includes(matchDetails.scorecard?.scorecardId)) {
        const totalRuns = data.runs.reduce((sum, run) => sum + run, 0);
        const totalBalls = data.overs.reduce((sum, ball) => sum + ball, 0);
        console.log(totalRuns)
        setTeamBScore(totalRuns);
        setTeamBovers(calculateOvers(totalBalls));
      }
    });

    // // Socket event listener for updates to the batting stats
    // socket.on("updatedBattingStats", (updatedStats: BattingStats) => {
    //   if (updatedStats.matchId === matchDetails.matchId) {
    //     fetchMatchDetails();
    //   }
    // });

    return () => {
      socket.off("teamAUpdate");
      socket.off("teamBUpdate");
      // socket.off("updatedBattingStats"); // Ensure cleanup of the listener
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
      console.log(Scorecard)
      await updateScoreCard({ scorecardId, Scorecard });
      // socket.emit("updateScorecard", {scorecardId, Scorecard });
    }
  };

  const fetchScoreCard = async () => {
    if (matchDetails.scorecard?.scorecardId !== undefined) {
      const response = await getScoreCardbyId({ scorecardId: matchDetails.scorecard.scorecardId });
      setScorecardId(response);
      console.log(response);
    }

  }

  useEffect(() => {
    if (matchDetails.isLive) {
      updateScorecard();
      fetchScoreCard();
    }
  }, [teamAScore, teamAovers, teamAWickets, teamBScore, teamBovers, teamBWickets]);

  return (
    <div className="grid grid-cols-2 gap-8 p-8 bg-gray-100 rounded-lg shadow-lg">
      {/* First Team Panel */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-blue-900">{matchDetails.firstTeamName}</h3>
        {matchDetails.isLive ? (
          <div>
            <p className="text-lg font-semibold text-gray-700">
              {scorecardId?.teamAScore}/{scorecardId?.teamAWickets}
            </p>
            <p className="text-sm text-gray-500">Overs: {scorecardId?.teamAOvers}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Match has not started yet</p>
        )}
      </div>

      {/* Second Team Panel */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-blue-900">{matchDetails.secondTeamName}</h3>
        {matchDetails.isLive ? (
          <div>
            <p className="text-lg font-semibold text-gray-700">
              {scorecardId?.teamBScore}/{scorecardId?.teamBWickets}
            </p>
            <p className="text-sm text-gray-500">Overs: {scorecardId?.teamBOvers}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Match has not started yet</p>
        )}
      </div>
    </div>
  );
};

export default ScorePanel;