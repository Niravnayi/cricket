import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Tournament } from "@/components/Dashboard/types/dashboard";

interface TournamentCardProps {
  tournament: Tournament;
  onDelete: (tournamentId: number) => void;
  onEdit: (tournament: Tournament) => void;
}

const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  onDelete,
  onEdit,
}) => {
  return (
    <motion.div
      key={tournament.tournamentId}
      className="relative bg-white shadow-xl rounded-2xl overflow-hidden mb-6 border border-gray-300
                 hover:shadow-2xl transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Tournament Info */}
      <Link href={`/organizer/tournament/${tournament.tournamentId}`}>
        <motion.div
          className="bg-gradient-to-br from-blue-500 to-purple-500 text-white p-8 relative 
                     hover:shadow-lg transition-all"
          whileHover={{ scale: 1.02 }}
        >
          {/* Stylish Glowing Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl"></div>

          <h2 className="text-3xl font-bold">{tournament.tournamentName}</h2>
          <p className="text-base mt-2 capitalize">
            Organizer: {tournament.organizer?.organizerName}
          </p>

          <div className="mt-4">
            <h3 className="text-lg font-medium">Teams:</h3>
            {tournament.teams?.map((team) => (
              <p key={team.id} className="text-sm text-gray-100">
                {team.team.teamName}
              </p>
            ))}
          </div>
        </motion.div>
      </Link>

      {/* Buttons Inside the Card */}
      <div className="p-6 bg-gray-100">
        <div className="flex justify-end gap-4">
          <motion.button
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 transition-all rounded-lg shadow-md 
                       hover:scale-105 active:scale-95"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(tournament)}
          >
            Edit
          </motion.button>
          <motion.button
            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 transition-all rounded-lg shadow-md
                       hover:scale-105 active:scale-95"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              tournament.tournamentId && onDelete(tournament.tournamentId)
            }
          >
            Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TournamentCard;
