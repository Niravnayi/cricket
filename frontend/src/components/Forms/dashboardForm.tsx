// TournamentForm.tsx
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Tournament } from '@/Types/tournament';
import { Team } from '@/Types/team';

interface TournamentFormProps {
  tournamentData?: Tournament;
  teamData: Team[];
  onSubmit: (tournament: Tournament) => void;
}

const TournamentForm: React.FC<TournamentFormProps> = ({ tournamentData, teamData, onSubmit }) => {
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
    <form onSubmit={handleSubmit}>
      <label className="block text-sm font-semibold text-gray-600">Tournament Name</label>
      <input
        type="text"
        value={tournamentName}
        onChange={(e) => setTournamentName(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#009270]"
        placeholder="Enter tournament name"
      />

      <label htmlFor="teamSelect" className="block text-sm font-semibold text-gray-600">
        Select Teams
      </label>
      <select
        id="teamSelect"
        onChange={(e) => handleTeamSelect(e.target.value)}
        className="p-2 w-full border border-gray-300 rounded-md"
      >
        <option value="">Select a Team</option>
        {teamData.map((team) => (
          <option key={team.teamId} value={team.teamId}>
            {team.teamName}
          </option>
        ))}
      </select>

      <ul>
        {teamIds.length > 0 && teamIds.map((teamId) => {
          const team = teamData.find((t) => t.teamId === teamId);
          return team ? <li key={teamId}>{team.teamName}</li> : null;
        })}
      </ul>

      <Button
        type="submit"
        className="px-6 py-2 bg-[#009270] text-white rounded-md hover:bg-[#007f5f]"
      >
        {tournamentData ? "Update Tournament" : "Create Tournament"}
      </Button>
    </form>
  );
};

export default TournamentForm;
