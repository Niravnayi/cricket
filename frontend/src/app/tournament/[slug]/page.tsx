"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTournamentDetails } from "@/Hooks/useTournamentData";

export default function Home() {
  const {
    tournament,
    activeTab,
    setActiveTab,
    liveMatches,
    scheduledMatches,
    completedMatches,
    error,
  } = useTournamentDetails();

  const renderMatches = (matches: typeof liveMatches) => (
    <ul className="space-y-6 mt-4">
      {matches.map((match, index) => (
        <Link
          key={index}
          href={`/matches/${match.matchId}`}
          className="space-y-14"
        >
          <li className="p-6 border rounded-lg bg-gray-100 shadow-md group transform transition-all hover:shadow-xl hover:-translate-y-2">
            <h5 className="text-2xl font-bold text-gray-800 group-hover:text-gray-600">
              {match.firstTeamName} vs {match.secondTeamName}
            </h5>
            <p className="text-gray-600 mt-2">Venue: {match.venue}</p>
            <p className="text-gray-600">
              Date: {new Date(match.dateTime).toLocaleString()}
            </p>
            {match.result && (
              <p className="text-gray-600">Result: {match.result}</p>
            )}
            <div className="mt-4">
              {match.isLive ? (
                <span className="px-4 py-2 bg-green-200 text-green-800 rounded-full text-sm animate-pulse">
                  Live
                </span>
              ) : (
                <span className="px-4 py-2 bg-red-200 text-red-800 rounded-full text-sm">
                  Not Live
                </span>
              )}
              {match.isCompleted && (
                <span className="px-4 py-2 bg-blue-200 text-blue-800 rounded-full text-sm ml-2">
                  Completed
                </span>
              )}
            </div>
            {match.scorecard && (
              <div className="mt-4 text-gray-600">
                <p>
                  Score: {match.scorecard.teamAScore}/
                  {match.scorecard.teamAWickets} vs {match.scorecard.teamBScore}
                  /{match.scorecard.teamBWickets}
                </p>
                <p>
                  Overs: {match.scorecard.teamAOvers} vs{" "}
                  {match.scorecard.teamBOvers}
                </p>
              </div>
            )}
          </li>
        </Link>
      ))}
    </ul>
  );

  if (error) {
    return <p className="text-red-500 text-center mt-8">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 to-gray-300 p-8">
      <div className="fixed top-0 left-0 right-0 bg-gray-800 z-10 p-4">
        <div className="flex justify-center space-x-4">
          <button
            className={`px-4 py-2 ${
              activeTab === "live"
                ? "bg-gray-700 text-white"
                : "bg-gray-200 text-gray-700"
            } rounded-lg shadow-md`}
            onClick={() => setActiveTab("live")}
          >
            Live Matches
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "scheduled"
                ? "bg-gray-700 text-white"
                : "bg-gray-200 text-gray-700"
            } rounded-lg shadow-md`}
            onClick={() => setActiveTab("scheduled")}
          >
            Scheduled Matches
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "completed"
                ? "bg-gray-700 text-white"
                : "bg-gray-200 text-gray-700"
            } rounded-lg shadow-md`}
            onClick={() => setActiveTab("completed")}
          >
            Completed Matches
          </button>
        </div>
      </div>
      <div className="pt-24 w-full max-w-6xl mx-auto space-y-12">
        <AnimatePresence mode="popLayout">
          {tournament && (
            <motion.div
              key={tournament.tournamentId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="border rounded-lg shadow-lg overflow-hidden bg-gray-200"
            >
              {activeTab === "live" && (
                <div className="p-6 bg-gray-300">
                  <h4 className="text-xl font-bold text-gray-800">
                    Live Matches:
                  </h4>
                  {renderMatches(liveMatches)}
                </div>
              )}
              {activeTab === "scheduled" && (
                <div className="p-6 bg-gray-300">
                  <h4 className="text-xl font-bold text-gray-800">
                    Scheduled Matches:
                  </h4>
                  {renderMatches(scheduledMatches)}
                </div>
              )}
              {activeTab === "completed" && (
                <div className="p-6 bg-gray-300">
                  <h4 className="text-xl font-bold text-gray-800">
                    Completed Matches:
                  </h4>
                  {renderMatches(completedMatches)}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
