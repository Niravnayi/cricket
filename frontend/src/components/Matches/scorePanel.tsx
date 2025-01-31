import React, { useCallback, useEffect, useRef, useState } from "react";
import { MatchDetails, Scorecard } from "./types/matchDetails";
import socket from "@/utils/socket";
import { getBattingStats } from "@/server-actions/battingStatsActions";
import { getScoreCardbyId, updateScoreCard } from "@/server-actions/scorecardActions";

interface ScorePanelProps {
  matchDetails: MatchDetails;
  isOrganizer: boolean;
  fetchMatchDetails: () => void;
}

const ScorePanel: React.FC<ScorePanelProps> = ({ matchDetails, fetchMatchDetails }) => {
  const isScorecardCreatedRef = useRef(false);
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamAovers, setTeamAovers] = useState("0");
  const [teamAWickets] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);
  const [teamBovers, setTeamBovers] = useState("0");
  const [teamBWickets] = useState(0);
  const [teamBExtrasRuns, setTeamBExtras] = useState(0)
  const [teamAExtrasRuns, setTeamAExtras] = useState(0)
  const [scoreCard, setScoreCard] = useState<Scorecard>();
  const [ totalExtras,setExtras ] = useState<number>();
  
  const isMounted = useRef(true);

  // Memoize calculateOvers to prevent unnecessary recreations
  const calculateOvers = useCallback((balls: number) => {
    return `${Math.floor(balls / 6)}.${balls % 6}`;
  }, []);

  useEffect(() => {
    isMounted.current = true;

    const handleExtrasUpdate = async (scorecardId,teamId,byes,legByes,wides,noBalls,totalExtras) => {
      console.log('i am here')
      console.log(totalExtras)
      setExtras(totalExtras)
      try {
        if (matchDetails.scorecard?.scorecardId) {
          const updatedScorecard = await getScoreCardbyId({
            scorecardId: matchDetails.scorecard.scorecardId
          });
          setScoreCard(updatedScorecard);
        }
      } catch (error) {
        console.error("Error handling extras update:", error);
      }
    };

    socket.on("extrasUpdate", handleExtrasUpdate);
    const handleTeamUpdate = (data: {
      runs: number[];
      overs: number[];
      scorecardId: number[];
      dismissedBatters: string[];
      teamName: string[];
    }) => {
      if (!isMounted.current) return;

      console.log('Received teamUpdate:', data);

      if (matchDetails.scorecard?.scorecardId &&
        data.scorecardId.includes(matchDetails.scorecard.scorecardId)) {
        let teamATotalRuns = 0;
        let teamATotalBalls = 0;
        let teamBTotalRuns = 0;
        let teamBTotalBalls = 0;

        // Initialize extra runs for both teams
        let teamAExtras = 0;
        let teamBExtras = 0;

        if (scoreCard?.extras) {
          Object.entries(scoreCard.extras).forEach(([, extrasObject]) => {
            console.log(extrasObject.teamName, 'teamName');
            if (extrasObject.teamName === matchDetails.firstTeamName) {
              teamAExtras = scoreCard?.extras?.find(e => e.teamName === matchDetails.firstTeamName)?.totalExtras || 0;
             
              setTeamAExtras(teamAExtras)
            } else if (extrasObject.teamName === matchDetails.secondTeamName) {
         teamBExtras = scoreCard?.extras?.find(e => e.teamName === matchDetails.secondTeamName)?.totalExtras || 0;
              console.log(teamBExtras)
              setTeamBExtras(teamBExtras)
              console.log(teamBExtras, 'teamBExtras');
            }
          });
        }
        console.log(teamAExtras)
        console.log(teamBExtras)

        data.teamName.forEach((team, index) => {
          if (team === matchDetails.firstTeamName &&
            data.scorecardId[index] === matchDetails.scorecard?.scorecardId) {
            teamATotalRuns += data.runs[index];
            teamATotalBalls += data.overs[index];
          } else if (team === matchDetails.secondTeamName &&
            data.scorecardId[index] === matchDetails.scorecard?.scorecardId) {
            teamBTotalRuns += data.runs[index];
            teamBTotalBalls += data.overs[index];
          }
        });


        setTeamAScore(teamATotalRuns);
        setTeamAovers(calculateOvers(teamATotalBalls));
        setTeamBScore(teamBTotalRuns);
        setTeamBovers(calculateOvers(teamBTotalBalls));
      }
    };

    // Register socket listener
    socket.on("teamUpdate", handleTeamUpdate);



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

        try {
          socket.emit("createScorecard", { matchId, Scorecard: newScorecard });
          isScorecardCreatedRef.current = true;
          fetchMatchDetails();
        } catch (error) {
          console.error("Error creating scorecard:", error);
        }
      }
    };

    const fetchInitialData = async () => {
      try {
        await manageScorecard();
        await getBattingStats();
        if (matchDetails.scorecard?.scorecardId) {
          const response = await getScoreCardbyId({
            scorecardId: matchDetails.scorecard.scorecardId
          });
          setScoreCard(response);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();

    return () => {
      isMounted.current = false;
      socket.off("teamUpdate", handleTeamUpdate);
      socket.off("extrasUpdate", handleExtrasUpdate);
    };
  }, [matchDetails, fetchMatchDetails, calculateOvers]);

  const teamBFinalScore = teamBScore + teamBExtrasRuns
  const teamAFinalScore = teamAScore + teamAExtrasRuns
  console.log(teamAFinalScore)
  console.log(teamBScore)
  const updateScorecard = useCallback(async () => {
    console.log(teamBFinalScore)
    if (!isMounted.current) return;

    const scorecardId = matchDetails.scorecard?.scorecardId;
    if (scorecardId !== undefined) {
      try {
        console.log(teamAFinalScore)
        await updateScoreCard({
          scorecardId,
          Scorecard: {
            teamAScore,
            teamBScore,
            teamAWickets,
            teamBWickets,
            teamAOvers: parseFloat(teamAovers),
            teamBOvers: parseFloat(teamBovers),
          }
        });
        const updatedScorecard = await getScoreCardbyId({ scorecardId });
        setScoreCard(updatedScorecard);
      } catch (error) {
        console.error("Error updating scorecard:", error);
      }
    }
  }, [teamAScore, teamAovers, teamBScore, teamBovers, matchDetails.scorecard]);

  useEffect(() => {
    if (matchDetails.isLive) {
      updateScorecard();
    }
  }, [updateScorecard, matchDetails.isLive]);
  console.log(scoreCard?.extras?.[0]?.totalExtras)
  console.log(scoreCard?.teamBScore)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-gradient-to-r from-blue-50 to-gray-100 rounded-lg shadow-xl">
      {/* First Team Panel */}
      <div className="bg-white rounded-lg shadow-lg p-6 text-center transition-all transform hover:scale-105 hover:shadow-2xl duration-300">
        <h3 className="text-2xl font-semibold text-blue-900">{matchDetails.firstTeamName}</h3>
        <div>
          <p className="text-3xl font-bold text-gray-800 transition-all duration-500 ease-in-out">
            {(scoreCard?.teamAScore ?? 0) + (totalExtras ?? 0)}/{scoreCard?.teamAWickets ?? 0}
          </p>
          <p className="text-md text-gray-500 transition-all duration-500 ease-in-out">
            Overs: {scoreCard?.teamAOvers ?? 0}
          </p>
          <p className="text-md text-gray-500">
            Extras: {
              scoreCard?.extras?.find(e => e.teamName === matchDetails.firstTeamName)?.totalExtras ?? 0
            }
          </p>
        </div>
      </div>

      {/* Second Team Panel */}
      <div className="bg-white rounded-lg shadow-lg p-6 text-center transition-all transform hover:scale-105 hover:shadow-2xl duration-300">
        <h3 className="text-2xl font-semibold text-blue-900">{matchDetails.secondTeamName}</h3>
        <div>
          <p className="text-3xl font-bold text-gray-800 transition-all duration-500 ease-in-out">
            {(scoreCard?.teamBScore ?? 0) + (scoreCard?.extras?.[0]?.totalExtras ?? 0)}/{scoreCard?.teamBWickets ?? 0}
          </p>
          <p className="text-md text-gray-500 transition-all duration-500 ease-in-out">
            Overs: {scoreCard?.teamBOvers ?? 0}
          </p>
          <p className="text-md text-gray-500">
            Extras: {
              scoreCard?.extras?.find(e => e.teamName === matchDetails.secondTeamName)?.totalExtras ?? 0
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScorePanel;