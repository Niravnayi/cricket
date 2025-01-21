import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axiosClient from "@/utils/axiosClient";
import { Tournament } from "@/Types/tournament";
import { Team } from "@/Types/team";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Match } from "@/Types/match";

export const useTournamentDetails = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<Team[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "live" | "scheduled" | "completed"
  >("live");
  const params = useParams();
  const id = params?.slug;

  useEffect(() => {
    async function fetchTournament() {
      if (!id) {
        setError("No ID provided for fetching tournaments");
        return;
      }
      try {
        const response = await axiosClient.get(`/tournaments/${id}`);
        if (response.status === 200) {
          setTournament(response.data);
        } else {
          setError(`Unexpected response: ${response.status}`);
        }
      } catch (err) {
        setError(`Failed to fetch tournament: ${err}`);
      }
    }

    fetchTournament();
    async function fetchTeams() {
      if (!id) {
        setError("No ID provided for fetching tournaments");
        return;
      }

      try {
        const response = await axiosClient.get(`/teams`);
        if (response.status === 200) {
          setTeams(response.data);
        } else {
          setError(`Unexpected response: ${response.status}`);
        }
      } catch (err) {
        setError(`Failed to fetch tournament: ${err}`);
      }
    }
    fetchTeams();
  }, [id]);
  const handleDelete = async (matchId: number) => {
    try {
      await axiosClient.delete(`/matches/${matchId}`);
      setTeams((prev) =>
       prev?.filter((team: Team) => team.teamId !== matchId) || null
      );
    } catch (error) {
      console.error("Error deleting tournament:", error);
    }
  };
  const liveMatches = tournament?.matches.filter((match) => match.isLive) || [];
  const scheduledMatches =
    tournament?.matches.filter(
      (match) => !match.isLive && !match.isCompleted
    ) || [];
  const completedMatches =
    tournament?.matches.filter((match) => match.isCompleted) || [];
    const [teamA, setTeamA] = useState("");
    const [teamB, setTeamB] = useState("");
    const [venue, setVenue] = useState("");
    const [date, setDate] = useState("");
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);  
  
    const getTeamIdByName = (name:string) => {
      const team = teams && teams.find(team => team.teamName === name);
      return team ? team.teamId : null;
    };
  
    const handleCreateMatch = async () => {
      const teamAId = getTeamIdByName(teamA);
      const teamBId = getTeamIdByName(teamB);
      
      const response = await axiosClient.post('/matches', {
        tournamentId: tournament?.tournamentId,
        firstTeamId: teamAId,
        secondTeamId: teamBId,
        venue: venue,
        dateTime: date
      });
  
      if (response?.status === 201) {
        setShowModal(false);
      }
    };
  
    const handleUpdateMatch = async () => {
      const teamAId = getTeamIdByName(teamA);
      const teamBId = getTeamIdByName(teamB);
  
      if (!selectedMatch) return;
      const response = await axiosClient.put(`/matches/${selectedMatch.matchId}`, {
        tournamentId: tournament?.tournamentId,
        firstTeamId: teamAId,
        secondTeamId: teamBId,
        venue: venue,
        dateTime: date
      });
  
      if (response?.status === 200) {
        setShowModal(false);
        setSelectedMatch(null); 
      }
    };
  
    const openEditModal = (match:Match) => {
      setSelectedMatch(match);
      setTeamA(match.firstTeamName);
      setTeamB(match.secondTeamName);
      setVenue(match.venue);
      setDate(new Date(match.dateTime).toISOString().slice(0, 16)); 
      setShowModal(true);
    };
  
    const renderMatches = (matches: Match[]) => (
      <ul className="space-y-6 mt-4">
        {matches.map((match, index) => (
          <div key={index}>
            <Link
              key={index}
              href={`/matches/${match.matchId}`}
              className="space-y-14"
            >
              <li className="p-6 border rounded-lg bg-gray-100 shadow-md group transform transition-all hover:shadow-xl hover:-translate-y-2">
                <h5 className="text-2xl font-bold text-gray-800 group-hover:text-gray-600">
                  {match.firstTeamName} vs {match.secondTeamName}
                </h5>
                <p className="text-gray-600 mt-2">Venue: {match.venue}</p>
                <p className="text-gray-600">
                  Date: {new Date(match.dateTime).toLocaleString()}
                </p>
                {match.result && (
                  <p className="text-gray-600">Result: {match.result}</p>
                )}
                <div className="mt-4">
                  {match.isLive ? (
                    <span className="px-4 py-2 bg-green-200 text-green-800 rounded-full text-sm animate-pulse">
                      Live
                    </span>
                  ) : (
                    <span className="px-4 py-2 bg-red-200 text-red-800 rounded-full text-sm">
                      Not Live
                    </span>
                  )}
                  {match.isCompleted && (
                    <span className="px-4 py-2 bg-blue-200 text-blue-800 rounded-full text-sm ml-2">
                      Completed
                    </span>
                  )}
                </div>
              </li>
            </Link>
            <Button onClick={() => {openEditModal(match);setShowModal(true)}} className="justify-end flex">Edit Match</Button>
            <Button onClick={() => handleDelete(match.matchId)} className="justify-end flex">Delete Match</Button>
          </div>
        ))}
      </ul>
    );
  
  return {
    tournament,
    teams,
    activeTab,
    handleDelete,
    setActiveTab,
    handleCreateMatch,
    teamA,
    teamB,
    setTeamA,
    setTeamB,
    venue,
    setVenue,
    date,
    setDate,
    handleUpdateMatch,
    renderMatches,
    showModal,
    selectedMatch,
    setShowModal,
    liveMatches,
    scheduledMatches,
    completedMatches,
    error,
  };
};
