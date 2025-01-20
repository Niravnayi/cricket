"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "@/utils/axiosClient"; // import axios client
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tournament } from "@/Types/tournament";
import { Team } from "@/Types/team";

const Dashboard = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tournamentName, setTournamentName] = useState("");
  const [teams, setTeams] = useState<number[]>([]);
  const [currentTournamentId, setCurrentTournamentId] = useState<number | null>(
    null
  );
  const [teamData, setTeamsData] = useState<Team[]>([]);

  const params = useParams();
  const id = params?.slug;

  useEffect(() => {
    async function fetchData() {
      if (id) {
        try {
          const teamDataResponse = await axiosClient.get("/teams");
          setTeamsData(teamDataResponse.data);

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

      // Reset state after operation
      setShowModal(false);
      setTournamentName("");
      setTeams([]);
      setIsEditing(false);
      setCurrentTournamentId(null);
    } catch (error) {
      console.error("Error creating/updating tournament:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosClient.delete(`/tournaments/${id}`);
      setTournaments((prev) =>
        prev.filter((tournament) => tournament.tournamentId !== id)
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

  const handleEdit = (tournament: Tournament) => {
    setTournamentName(tournament.tournamentName);
    setCurrentTournamentId(tournament.tournamentId);
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-[#009270] text-white py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <section className="mb-8">
          {tournaments.length > 0 ? (
            tournaments.map((tournament) => (
              <div
                key={tournament.tournamentId}
                className="bg-white shadow-lg rounded-lg overflow-hidden mb-6"
              >
                <div className="bg-[#009270] text-white p-10 hover:shadow-[0_0_20px_rgb(0,153,112)] hover:scale-105 transition-all duration-300">
                  <h2 className="text-2xl font-bold">
                    {tournament.tournamentName}
                  </h2>
                  <p className="text-sm">
                    Organizer ID: {tournament.organizerId}
                  </p>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-white">Teams:</h3>

                    {tournament.teams.map((team) => (
                      <p key={team.id} className="text-sm text-gray-300">
                        {team.team.teamName}
                      </p>
                    ))}
                    <div className="flex justify-between">
                      <button
                        className="p-2 mt-5 justify-end w-24 text-white bg-red-600 hover:bg-red-700 transition-all duration-300"
                        onClick={() => handleDelete(tournament.tournamentId)}
                      >
                        Delete
                      </button>
                      <button
                        className="p-2 mt-5 justify-end w-24 text-black bg-blue-500 hover:bg-blue-600 transition-all duration-300"
                        onClick={() => handleEdit(tournament)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No tournaments found.</p>
          )}
        </section>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogTrigger asChild>
            <Button className="px-6 py-2 bg-[#009270] text-white rounded-md hover:bg-[#007f5f]">
              Create Tournament
            </Button>
          </DialogTrigger>

          <DialogContent className="p-8 max-w-lg">
            <DialogTitle className="text-2xl font-semibold mb-4">
              {isEditing ? "Edit Tournament" : "Create New Tournament"}
            </DialogTitle>

            <DialogDescription className="mb-6 text-gray-700">
              Please fill in the tournament details.
            </DialogDescription>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-semibold text-gray-600"
                  htmlFor="teamsName"
                >
                  Teams Name
                </label>
                <div className="py-5">
                  <label
                    htmlFor="teamSelect"
                    className="block text-sm font-semibold text-gray-600"
                  >
                    Select a Team
                  </label>
                  <select
                    id="teamSelect"
                    className="p-2 w-full border border-gray-300 rounded-md"
                    onChange={handleTeamSelect}
                  >
                    <option value="">Select a Team</option>
                    {teamData.map((team) => (
                      <option key={team.teamId} value={team.teamId}>
                        {team.team.teamName}
                      </option>
                    ))}
                  </select>
                </div>

                <label
                  className="block text-sm font-semibold text-gray-600"
                  htmlFor="tournamentName"
                >
                  Tournament Name
                </label>
                <input
                  type="text"
                  id="tournamentName"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009270]"
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                  placeholder="Enter tournament name"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-semibold text-gray-600"
                  htmlFor="teams"
                >
                  Selected Teams:
                </label>
                <ul className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009270]">
                  {teams.map((teamId) => {
                    const team = teamData.find((t) => t.teamId === teamId);
                    return team ? (
                      <li key={teamId} className="text-sm text-gray-600">
                        {team.team.teamName}
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>

              <DialogFooter>
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2"
                >
                  Close
                </Button>
                <Button
                  onClick={handleCreateTournament}
                  className="px-6 py-2 bg-[#009270] text-white rounded-md hover:bg-[#007f5f]">
                  {isEditing ? "Update Tournament" : "Create Tournament"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Dashboard;
