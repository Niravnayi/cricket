"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDashboard } from "@/Hooks/useDashboard";

const Dashboard = () => {
  const {
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
  } = useDashboard();

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
                <div className="bg-[#009270] text-white p-10 hover:shadow-lg hover:scale-105 transition-all duration-300">
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
                        className="p-2 mt-5 w-24 text-white bg-red-600 hover:bg-red-700 transition-all"
                        onClick={() => handleDelete(tournament.tournamentId)}
                      >
                        Delete
                      </button>
                      <button
                        className="p-2 mt-5 w-24 text-black bg-blue-500 hover:bg-blue-600 transition-all"
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
              <label className="block text-sm font-semibold text-gray-600">
                Tournament Name
              </label>
              <input
                type="text"
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#009270]"
              />
              <label className="block text-sm font-semibold text-gray-600">
                Select Teams
              </label>
              <select
                onChange={handleTeamSelect}
                className="p-2 w-full border border-gray-300 rounded-md"
              >
                <option value="">Select a Team</option>
                {teamData.map((team) => (
                  <option key={team.teamId} value={team.teamId}>
                    {team.team.teamName}
                  </option>
                ))}
              </select>
              <ul>
                {teams.map((teamId) => {
                  const team = teamData.find((t) => t.teamId === teamId);
                  return team ? (
                    <li key={teamId}>{team.team.teamName}</li>
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
                className="px-6 py-2 bg-[#009270] text-white rounded-md hover:bg-[#007f5f]"
              >
                {isEditing ? "Update Tournament" : "Create Tournament"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Dashboard;
