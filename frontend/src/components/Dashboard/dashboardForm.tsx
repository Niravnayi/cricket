import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Team, Tournament } from './types/dashboard';

interface TournamentFormProps {
  tournamentData: Tournament | null;
  teamData: Team[];
  onSubmit: (tournament: Tournament) => void;
  onClose: () => void; // New prop for handling the close action
}

const TournamentForm: React.FC<TournamentFormProps> = ({ tournamentData, teamData, onSubmit, onClose }) => {
  const [tournamentName, setTournamentName] = useState(tournamentData?.tournamentName || '');
  const [teamIds, setTeams] = useState<number[]>(tournamentData?.teams?.map((team) => team.teamId) || []);

  const handleTeamSelect = (teamId: string) => {
    const teamIdInt = parseInt(teamId);
    setTeams((prevTeams) => {
      if (!prevTeams.includes(teamIdInt)) {
        return [...prevTeams, teamIdInt];
      }
      return prevTeams;
    });
  };

  const handleRemoveTeam = (teamId: number) => {
    setTeams((prevTeams) => prevTeams.filter((id) => id !== teamId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tournament: Tournament = {
      tournamentName,
      organizerId: 1,
      teamIds
    };
    onSubmit(tournament);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md space-y-6 max-w-xl mx-auto"
    >
      <h2 className="text-xl font-bold text-gray-800">
        {tournamentData ? "Update Tournament" : "Create Tournament"}
      </h2>

      <div className="space-y-2">
        <label htmlFor="tournamentName" className="block text-sm font-semibold text-gray-700">
          Tournament Name
        </label>
        <input
          type="text"
          id="tournamentName"
          value={tournamentName}
          onChange={(e) => setTournamentName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#009270] focus:outline-none"
          placeholder="Enter tournament name"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="teamSelect" className="block text-sm font-semibold text-gray-700">
          Select Teams
        </label>
        <select
          id="teamSelect"
          onChange={(e) => handleTeamSelect(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#009270] focus:outline-none"
        >
          <option value="">Select a Team</option>
          {teamData.map((team) => (
            <option key={team.teamId} value={team.teamId}>
              {team.teamName}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-700">Selected Teams:</p>
        <div className="flex flex-wrap gap-2">
          {teamIds.length > 0 ? (
            teamIds.map((teamId) => {
              const team = teamData.find((t) => t.teamId === teamId);
              return team ? (
                <div
                  key={teamId}
                  className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full shadow-sm"
                >
                  <span>{team.teamName}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTeam(teamId)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    &times;
                  </button>
                </div>
              ) : null;
            })
          ) : (
            <p className="text-gray-500">No teams selected.</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="submit"
          className="px-6 py-2 bg-[#009270] text-white font-semibold rounded-md hover:bg-[#007f5f] transition duration-300"
        >
          {tournamentData ? "Update Tournament" : "Create Tournament"}
        </Button>
        <Button
          type="button"
          onClick={onClose} 
          className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400 transition duration-300"
        >
          Close
        </Button>
      </div>
    </form>
  );
};

export default TournamentForm;
