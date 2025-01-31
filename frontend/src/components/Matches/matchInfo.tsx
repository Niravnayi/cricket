import React, { useState } from 'react';
import { MatchDetails } from './types/matchDetails';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import socket from '@/utils/socket';
import { Scorecard } from '@/components/Matches/types/matchDetails';
import { setScoreCard } from '@/server-actions/scorecardActions';
import { updateMatch } from '@/server-actions/matchesActions';

interface MatchInfoProps {
  matchDetails: MatchDetails;
  id: number;
}

const MatchInfo: React.FC<MatchInfoProps> = ({ matchDetails, id }) => {
  const [isLive, setIsLive] = useState(matchDetails.isLive);

  
  const handleIsLive = async () => {
    await updateMatch({
      id,
      tournamentId: matchDetails.tournamentId ?? 0,
      firstTeamId: matchDetails.firstTeamId,
      secondTeamId: matchDetails.secondTeamId,
      venue: matchDetails.venue,
      isLive:matchDetails.isLive ? false : true,
      dateTime: new Date(matchDetails.dateTime).toISOString(),
    });
    console.log(matchDetails)

    const scorecard = {
      teamAScore: 0,
      teamBScore: 0,
      teamAWickets: 0,
      teamBWickets: 0,
      teamAName: matchDetails.firstTeamName ?? "Unknown Team A",
      teamBName: matchDetails.secondTeamName ?? "Unknown Team B",
      teamAOvers: 0,
      teamBOvers: 0
    }
    console.log(matchDetails.scorecard)
    if(!matchDetails.scorecard){
await setScoreCard({ matchId: matchDetails.matchId, Scorecard: scorecard });
    }

    socket.on("scoreUpdate", (updatedScore:Scorecard) => {
      console.log("Score update received:", updatedScore);
    });
  
    return () => {
      socket.off("scoreUpdate");
    };
  };

  return (
    <div className="bg-green-600 text-white p-6">
      <div className="flex items-center space-x-2">
        <Switch id="live" checked={isLive} onCheckedChange={(checked) => { setIsLive(checked); handleIsLive(); }} />
        <Label htmlFor="live">Live</Label>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">
            {matchDetails.firstTeamName} vs{" "}
            {matchDetails.secondTeamName}
          </h2>
          <p className="text-sm">{matchDetails.venue}</p>
          <p className="text-sm">
            {new Date(matchDetails.dateTime).toLocaleString()}
          </p>
        </div>
        <div>
          <p
            className={`text-xl font-semibold ${isLive ? "text-red-500" : "text-gray-300"}`}
          >
            {isLive ? "LIVE" : matchDetails.result}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MatchInfo;