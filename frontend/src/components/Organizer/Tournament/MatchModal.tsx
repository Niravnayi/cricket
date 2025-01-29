"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Match } from "@/components/Organizer/Tournament/types/tournamentType";
import { Team } from "@/components/Tournament/types/tournament";
import { createMatch, fetchTournamentMatches, updateMatch } from "@/server-actions/matchesActions";
import { fetchTournamentById } from "@/server-actions/tournamentsActions";

interface MatchModalProps {
  tournamentId: number;
  editingMatch: Match | null;
  onClose: () => void;
  onSave: () => void;
}

const MatchModal: React.FC<MatchModalProps> = ({tournamentId, editingMatch, onClose, onSave}) => {

  const [teams, setTeams] = useState<Team[]>([]);
  const [teamAId, setTeamAId] = useState<number | null>(editingMatch?.firstTeamId || null);

  const [teamBId, setTeamBId] = useState<number | null>(editingMatch?.secondTeamId || null);
  const [venue, setVenue] = useState<string>(editingMatch?.venue || "");
  const [date, setDate] = useState<string>(
    editingMatch?.dateTime? new Date(editingMatch.dateTime).toISOString().slice(0, 16) : ""
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const tournament = await fetchTournamentById(tournamentId);
        console.log(tournament)
        const tournamentTeams = tournament.teams.map((team: { team: Team }) => ({
          teamId: team.team.teamId,
          teamName: team.team.teamName,
        }));
        setTeams(tournamentTeams); 
        await fetchTournamentMatches(tournamentId);
      } 
      catch (err) {
        console.log("Error fetching teams:", err);
      }
    };
  
    fetchTeams();
  }, [tournamentId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamAId || !teamBId || !venue || !date) {
      setError("Please fill all fields.");
      return;
    }

    if (teamAId === teamBId) {
      setError("Teams A and B must be different.");
      return;
    }

    try {
      setLoading(true);

      const id = editingMatch?.matchId
      if (editingMatch && id) {
        await updateMatch({id, tournamentId, isLive:false,firstTeamId: teamAId, secondTeamId: teamBId, venue, dateTime:date});
      } 
      else {
        await createMatch(tournamentId, teamAId, teamBId, venue, date);
      }
      onSave();
      onClose();
    } 
    catch (err) {
        console.log(err)
      setError("Error saving match. Please try again.");
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {editingMatch ? "Edit Match" : "Create Match"}
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="teamA" className="block text-sm font-semibold text-gray-700">
              Team A
            </label>
            <select
              id="teamA"
              value={teamAId || ""}
              onChange={(e) => setTeamAId(parseInt(e.target.value))}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Team A</option>
              {teams.map((team) => (
                <option key={team.teamId} value={team.teamId}>
                  {team.teamName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="teamB" className="block text-sm font-semibold text-gray-700">
              Team B
            </label>
            <select
              id="teamB"
              value={teamBId || ""}
              onChange={(e) => setTeamBId(parseInt(e.target.value))}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Team B</option>
              {teams.map((team) => (
                <option key={team.teamId} value={team.teamId}>
                  {team.teamName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="venue" className="block text-sm font-semibold text-gray-700">
              Venue
            </label>
            <input
              type="text"
              id="venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter venue"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-semibold text-gray-700">
              Date & Time
            </label>
            <input
              type="datetime-local"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-md ${loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"} text-white`}
            >
              {loading ? "Saving..." : editingMatch ? "Update Match" : "Create Match"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default MatchModal;