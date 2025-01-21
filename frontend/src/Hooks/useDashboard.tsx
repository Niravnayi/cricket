import { useEffect, useState } from "react";
import axiosClient from "@/utils/axiosClient";
import { useParams } from "next/navigation";
import { Tournament } from "@/Types/tournament";
import { Team } from "@/Types/team";

export const useDashboard = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tournamentName, setTournamentName] = useState("");
  const [teams, setTeams] = useState<number[]>([]);
  
  const [currentTournamentId, setCurrentTournamentId] = useState<number | null>(
    null
  );
  const [teamData, setTeamData] = useState<Team[]>([]);
  const params = useParams();
  const id = params?.slug;

  useEffect(() => {
    async function fetchData() {
      if (id) {
        try {
          const teamDataResponse = await axiosClient.get("/teams");
          setTeamData(teamDataResponse.data);

          const tournamentsResponse = await axiosClient.get(
            `/organizers/tournaments/${id}`
          );
          const data = Array.isArray(tournamentsResponse.data)
            ? tournamentsResponse.data
            : [tournamentsResponse.data];
          setTournaments(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    }
    fetchData();
  }, [id]);

  const handleCreateTournament = async () => {
    try {
      setIsEditing(false)
      const newTournament = {
        tournamentName,
        organizerId: id ? parseInt(id as string) : 0,
        teamIds: teams,
      };

      if (isEditing && currentTournamentId !== null) {
        // Update the existing tournament
        await axiosClient.put(
          `/tournaments/${currentTournamentId}`,
          newTournament
        );
      } else {
        // Create a new tournament
        await axiosClient.post(`/tournaments/`, newTournament);
      }

      const updatedData = await axiosClient.get(
        `/organizers/tournaments/${id}`
      );
      setTournaments(updatedData.data);
      setShowModal(false);
      setTournamentName("");
      setTeams([]);
      setIsEditing(false);
      setCurrentTournamentId(null);
    } catch (error) {
      console.error("Error creating/updating tournament:", error);
    }
  };

  const handleDelete = async (tournamentId: number) => {
    try {
      await axiosClient.delete(`/tournaments/${tournamentId}`);
      setTournaments((prev) =>
        prev.filter((tournament) => tournament.tournamentId !== tournamentId)
      );
    } catch (error) {
      console.error("Error deleting tournament:", error);
    }
  };

  const handleTeamSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTeamId = parseInt(event.target.value);
    if (!teams.includes(selectedTeamId)) {
      setTeams((prevTeams) => [...prevTeams, selectedTeamId]);
    }
  };

  useEffect(() => {
    console.log("showModal state changed to:", showModal);
  }, [showModal]);
  const handleEdit = (tournament: Tournament) => {

    console.log(tournament)
    setTournamentName(tournament.tournamentName);
    setCurrentTournamentId(tournament.tournamentId);
    setIsEditing(true);
    setShowModal(true);
  };

  return {
    tournaments,
    showModal,
    isEditing,
    tournamentName,
    teams,
    teamData,
    setShowModal,
    setTournamentName,
    handleCreateTournament,
    handleDelete,
    handleTeamSelect,
    handleEdit,
  };
};
