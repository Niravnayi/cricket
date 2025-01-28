"use client";
import React, { useEffect, useState } from "react";
import axiosClient from "../../utils/axiosClient";
import { Match } from "./types";
import { motion } from "framer-motion";
import Link from "next/link";

const MatchesList = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axiosClient.get("/matches");
        setMatches(response.data);
      } catch (err) {
        setError("Failed to fetch matches data. Please try again later.");
      }
    };

    fetchMatches();
  }, []);

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Live Matches
      </h1>
      {matches.length > 0 ? (
        <motion.ul
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {matches.map((match) => (
            <motion.li
              key={match.matchId}
              className="bg-white border p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        <p className="text-center text-xl font-semibold mt-8 text-blue-500 animate-pulse">
          Loading matches...
        </p>
      )}
    </div>
  );
};

export default MatchesList;
