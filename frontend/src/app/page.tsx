"use client";
import React, { useEffect, useState } from "react";
import axiosClient from "@/utils/axiosClient";
import { motion } from "framer-motion";
import Link from "next/link";
import { Match, Team, Tournament } from "./types";
import { fetchTeamData } from "@/server-actions/teamsActions";
import { fetchAllTournaments } from "@/server-actions/tournamentsActions";

const HomePage = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchesResponse = await axiosClient.get("/matches");
        setMatches(matchesResponse.data);

        const teamsResponse = await fetchTeamData();
        setTeams(teamsResponse);
        
        const tournamentsResponse = await fetchAllTournaments();
        setTournaments(tournamentsResponse);
        console.log(teamsResponse.data);
      } 
      catch (error) {
        console.error("Error fetching data:", error);
      } 
      finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-400 ">
        <motion.div
          className="text-black text-2xl font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div>
            <span className="loader"></span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (

    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-8">
      <header className="text-center pb-8">
        <motion.h1
          className="text-4xl font-extrabold text-indigo-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Live Cricket Updates
        </motion.h1>
        <motion.p
          className="text-lg text-gray-600 mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Get the latest live matches, teams, and tournament details
        </motion.p>
      </header>

      {/* Matches Section */}
      <motion.section
        className="my-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-semibold text-gray-700 mb-6 text-center">
          Matches
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <motion.div
              key={match.matchId}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-transform transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Link href={`/matches/${match.matchId}`}>
                <h2 className="text-xl font-semibold text-center mb-2">
                  {match.firstTeamName} <span className="text-red-500">vs</span>{" "}
                  {match.secondTeamName}
                </h2>
                <p className="text-gray-700 text-sm mb-1">
                  Venue: {match.venue}
                </p>
                <p className="text-gray-700 text-sm mb-1">
                  Date: {new Date(match.dateTime).toLocaleString()}
                </p>
                <p className="text-gray-700 text-sm mb-1">
                  Status:{" "}
                  <span
                    className={`font-bold ${
                      match.isLive ? "text-green-500" : "text-gray-500"
                    }`}
                  >
                    {match.isLive ? "Live" : "Not Live"}
                  </span>
                </p>
                <p className="text-gray-700 text-sm mb-4">
                  Result: {match.result}
                </p>
                {match.scorecard && (
                  <>
                    <h3 className="text-lg mt-2 font-bold text-center">
                      Scorecard:
                    </h3>
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <div>
                        <p className="font-semibold">{match.firstTeamName}:</p>
                        <p>
                          {match.scorecard.teamAScore}/
                          {match.scorecard.teamAWickets} (
                          {match.scorecard.teamAOvers} overs)
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">{match.secondTeamName}:</p>
                        <p>
                          {match.scorecard.teamBScore}/
                          {match.scorecard.teamBWickets} (
                          {match.scorecard.teamBOvers} overs)
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Teams Section */}
      <motion.section
        className="my-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-semibold text-gray-700 mb-6 text-center">
          Teams
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <motion.div
              key={team.teamId}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-transform transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                {team.teamName}
              </h3>
              <div className="mb-4">
                <h4 className="text-lg font-medium mb-1">Players</h4>
                <ul className="list-disc list-inside">
                  {team.players.map((player) => (
                    <li key={player.playerId} className="text-sm text-gray-600">
                      {player.playerName} ({player.playerRole})
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-1">Tournaments</h4>
                <ul className="list-disc list-inside">
                  {team.tournamentTeams.map((tournament) => (
                    <li key={tournament.id} className="text-sm text-gray-600">
                      {tournament.tournament.tournamentName}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Tournaments Section */}
      <motion.section
        className="my-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-semibold text-gray-700 mb-6 text-center">
          Tournaments
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <Link
              key={tournament.tournamentId}
              href={`/tournament/${tournament.tournamentId}`}
            >
              <motion.div
                key={tournament.tournamentId}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-transform transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-semibold text-indigo-600">
                  {tournament.tournamentName}
                </h3>
                <ul className="mt-4 text-gray-500">
                  {tournament.teams.map((team) => (
                    <li key={team.team.teamId}>{team.team.teamName}</li>
                  ))}
                </ul>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;

