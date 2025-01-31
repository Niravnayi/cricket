import React, { useEffect, useState } from "react";
import { fetchMatchById } from "../../server-actions/matchesActions";
import MatchInfo from "@/components/Matches/MatchInfo";
import ScorePanel from "@/components/Matches/ScorePanel";
import BowlingStatsComponent from "@/components/Matches/BowlingStatsComponent";
import TeamSquadComponents from "./TeamSquadComponents";
import { MatchDetails } from "./types/matchDetails";
import socket from "@/utils/socket";
import ScoreCardComponent from "./ScoreCardComponent";
import ControlPanel from "./ControlPanel";

interface MatchPageProps {
  id: number;
}
  
const MatchPage: React.FC<MatchPageProps> = ({ id }) => {
  const [matchDetails, setMatchDetails] = useState<MatchDetails>();

  const fetchMatchDetails = async () => {
    const data = await fetchMatchById(id);
    setMatchDetails(data);
  };

  useEffect(() => {
    fetchMatchDetails();

    // Real-time updates for match changes
    socket.on("matchUpdated", (updatedMatch: MatchDetails) => {
      setMatchDetails(updatedMatch);
    });

    return () => {
      socket.off("matchUpdated");
    };
  }, [id]);

  if (!matchDetails) {
    return (
      <div>
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <MatchInfo matchDetails={matchDetails} id={id} />
      <ScorePanel
        matchDetails={matchDetails}
        isOrganizer={true}
        fetchMatchDetails={fetchMatchDetails}
      />
      <ControlPanel matchDetails = {matchDetails}/>
      <BowlingStatsComponent matchDetails={matchDetails} />
      <ScoreCardComponent id={id} />
      <TeamSquadComponents id={id} />
    </div>
  );
};

export default MatchPage;
