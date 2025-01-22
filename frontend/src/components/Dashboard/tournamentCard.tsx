// TournamentCard.tsx
import React from 'react';
import Link from 'next/link';
import { Tournament } from '@/Types/tournament';

interface TournamentCardProps {
  tournament: Tournament;
  onDelete: (tournamentId: number) => void;
  onEdit: (tournament: Tournament) => void;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, onDelete, onEdit }) => {
  return (
    <div key={tournament.tournamentId}>
      <Link href={`/organizer/tournament/${tournament.tournamentId}`}>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
          <div className="bg-[#009270] text-white p-10 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <h2 className="text-2xl font-bold">{tournament.tournamentName}</h2>
            <p className="text-sm">Organizer ID: {tournament.organizerId}</p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-white">Teams:</h3>
              {tournament.teams && tournament.teams.map((team) => (
                <p key={team.id} className="text-sm text-gray-300">{team.team.teamName}</p>
              ))}
            </div>
          </div>
        </div>
      </Link>
      <div className="flex justify-between">
        <button
          className="p-2 mt-5 w-24 text-white bg-red-600 hover:bg-red-700 transition-all"
          onClick={() => tournament.tournamentId && onDelete(tournament.tournamentId)}
        >
          Delete
        </button>

        <button
          className="p-2 mt-5 w-24 text-black bg-blue-500 hover:bg-blue-600 transition-all"
          onClick={() => onEdit(tournament)}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default TournamentCard;
