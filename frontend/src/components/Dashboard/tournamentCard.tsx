import React from 'react';
import Link from 'next/link';
import { Tournament } from './types/dashboard';

interface TournamentCardProps {
  tournament: Tournament;
  onDelete: (tournamentId: number) => void;
  onEdit: (tournament: Tournament) => void;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, onDelete, onEdit }) => {
  return (
    <div
      key={tournament.tournamentId}
      className="bg-white shadow-lg rounded-lg overflow-hidden mb-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
    >
      {/* Tournament Info */}
      <Link href={`/organizer/tournament/${tournament.tournamentId}`}>
        <div className="bg-gradient-to-b from-blue-300 to-gray-300 text-white p-8 hover:shadow-lg">
          <h2 className="text-2xl md:text-3xl font-semibold">{tournament.tournamentName}</h2>
          <p className="text-sm md:text-base mt-2 capitalize">Organizer Name: {tournament.organizer?.organizerName}</p>

          <div className="mt-4">
            <h3 className="text-lg md:text-xl font-medium">Teams:</h3>
            {tournament.teams &&
              tournament.teams.map((team) => (
                <p key={team.id} className="text-sm md:text-base text-gray-100">
                  {team.team.teamName}
                </p>
              ))}
          </div>
        </div>
      </Link>

      {/* Buttons Inside the Card */}
      <div className="p-6 bg-gray-100">
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 transition-all rounded-md shadow-md"
            onClick={() => onEdit(tournament)}
          >
            Edit
          </button>
          <button
            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 transition-all rounded-md shadow-md"
            onClick={() => tournament.tournamentId && onDelete(tournament.tournamentId)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TournamentCard;
