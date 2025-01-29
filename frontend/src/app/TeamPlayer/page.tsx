"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosClient from "@/utils/axiosClient";
import { Tournament, Team } from "./Types/Types";

const TeamsPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [userTournaments, setUserTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    const fetchUserId = async () => {
      const loggedInUserId = 1; // Simulate fetching user ID
      setUserId(loggedInUserId);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axiosClient.get<Team[]>("/teams");
        setTeams(response.data);

        if (userId !== null) {
          const tournaments = response.data.flatMap((team) =>
            team.players.some((player) => player.playerId === userId)
              ? team.tournamentTeams.map((t) => t.tournament)
              : []
          );
          setUserTournaments(tournaments);
        }
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("Failed to load teams.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [userId]);

  if (loading) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen bg-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center text-indigo-500 text-xl font-semibold">
          Loading teams...
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <motion.div
          className="text-center text-red-500 text-xl font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {error}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-100 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.h1
        className="text-4xl font-extrabold text-indigo-600 text-center mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Tournaments Where You Play
      </motion.h1>

      {userTournaments.length > 0 ? (
        <motion.div
          className="bg-white shadow-lg rounded-lg p-6 mb-8"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Your Tournaments:
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            {userTournaments.map((tournament, index) => (
              <li key={`${tournament.id}-${index}`} className="text-lg">
                {tournament.tournamentName}
              </li>
            ))}
          </ul>
        </motion.div>
      ) : (
        <motion.div
          className="bg-white shadow-lg rounded-lg p-6 mb-8"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <p className="text-gray-600">
            You are not registered in any tournaments.
          </p>
        </motion.div>
      )}

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Teams:</h2>
      <motion.ul
        className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
        }}
      >
        {teams.map((team) => (
          <motion.li
            key={team.teamId}
            className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition duration-300 ease-in-out"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h3 className="text-2xl font-medium text-gray-800 mb-4">
              {team.teamName}
            </h3>
            <ul className="text-gray-600 space-y-2">
              {team.players.map((player, index) => (
                <li
                  key={`${player.playerId}-${index}`}
                  className={
                    player.playerId === userId
                      ? "font-semibold text-blue-600"
                      : ""
                  }
                >
                  {player.playerName}
                </li>
              ))}
            </ul>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
};

export default TeamsPage;
