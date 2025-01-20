// Matches.tsx
"use client";

import { useMatchData } from "@/Hooks/useFetchMatches ";
import React from "react";

const Matches = () => {
  const { match } = useMatchData(); // Use the hook

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-green-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Next Innings</h1>
          <nav className="space-x-6">
            <a href="#" className="hover:text-green-300">
              Live Scores
            </a>
            <a href="#" className="hover:text-green-300">
              Schedule
            </a>
            <a href="#" className="hover:text-green-300">
              News
            </a>
            <a href="#" className="hover:text-green-300">
              Teams
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Live Matches</h2>
          {match.length > 0 ? (
            match.map((matchDetails) => (
              <div
                key={matchDetails.matchId}
                className="bg-white shadow-lg rounded-lg overflow-hidden mb-6"
              >
                {/* Match Information */}
                <div className="bg-green-600 text-white p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {matchDetails.firstTeamName} vs{" "}
                        {matchDetails.secondTeamName}
                      </h2>
                      <p className="text-sm">{matchDetails.venue}</p>
                      <p className="text-sm">
                        {new Date(matchDetails.dateTime).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-xl font-semibold ${
                          matchDetails.isLive ? "text-red-500" : "text-gray-300"
                        }`}
                      >
                        {matchDetails.isLive ? "LIVE" : matchDetails.result}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Score Panel */}
                <div className="grid grid-cols-2 gap-6 p-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-blue-900">
                      {matchDetails.firstTeamName}
                    </h3>
                    <p className="text-lg text-gray-700">
                      {matchDetails.scorecard.teamAScore}/
                      {matchDetails.scorecard.teamAWickets}
                    </p>
                    <p className="text-sm text-gray-500">
                      Overs: {matchDetails.scorecard.teamAOvers}
                    </p>
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-blue-900">
                      {matchDetails.secondTeamName}
                    </h3>
                    <p className="text-lg text-gray-700">
                      {matchDetails.scorecard.teamBScore}/
                      {matchDetails.scorecard.teamBWickets}
                    </p>
                    <p className="text-sm text-gray-500">
                      Overs: {matchDetails.scorecard.teamBOvers}
                    </p>
                  </div>
                </div>

                {/* Batting Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">
                        Batting Stats - {matchDetails.firstTeamName}
                      </h3>
                      {matchDetails.scorecard.battingStats
                        .filter(
                          (player) =>
                            player.teamName === matchDetails.firstTeamName
                        )
                        .map((player) => (
                          <div
                            key={player.playerName}
                            className="flex justify-between text-sm text-gray-600"
                          >
                            <span>{player.playerName}</span>
                            <span>
                              {`${player.runs} runs (${player.balls} balls)`}
                            </span>
                            <span>
                              SR: {(player.runs / player.balls) * 100}
                            </span>
                          </div>
                        ))}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">
                        Batting Stats - {matchDetails.secondTeamName}
                      </h3>
                      {matchDetails.scorecard.battingStats
                        .filter(
                          (player) =>
                            player.teamName === matchDetails.secondTeamName
                        )
                        .map((player) => (
                          <div
                            key={player.playerName}
                            className="flex justify-between text-sm text-gray-600"
                          >
                            <span>{player.playerName}</span>
                            <span>
                              {player.runs} runs ({player.balls} balls)
                            </span>
                            <span>
                              SR: {(player.runs / player.balls) * 100}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Bowling Stats */}
                  <div className="grid grid-cols-2 gap-6 mt-6">
                    <div>
                      <h3 className="text-lg font-semibold text-red-900">
                        Bowling Stats - {matchDetails.firstTeamName}
                      </h3>
                      {matchDetails.scorecard.bowlingStats
                        .filter(
                          (player) =>
                            player.teamName === matchDetails.firstTeamName
                        )
                        .map((player) => (
                          <div
                            key={player.playerName}
                            className="flex justify-between text-sm text-gray-600"
                          >
                            <span>{player.playerName}</span>
                            <span>
                              {player.overs} overs, {player.wickets} wickets
                            </span>
                            <span>
                              Economy: {player.runsConceded}/{player.overs}
                            </span>
                          </div>
                        ))}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-red-900">
                        Bowling Stats - {matchDetails.secondTeamName}
                      </h3>
                      {matchDetails.scorecard.bowlingStats
                        .filter(
                          (player) =>
                            player.teamName === matchDetails.secondTeamName
                        )
                        .map((player) => (
                          <div
                            key={player.playerName}
                            className="flex justify-between text-sm text-gray-600"
                          >
                            <span>{player.playerName}</span>
                            <span>
                              {player.overs} overs, {player.wickets} wickets
                            </span>
                            <span>
                              Economy: {player.runsConceded / player.overs}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Match Status */}
                <div className="flex justify-between items-center p-6 border-t border-gray-200">
                  <div className="text-center">
                    {matchDetails.isLive ? (
                      <span className="text-red-500 text-lg font-semibold">
                        LIVE
                      </span>
                    ) : matchDetails.isCompleted ? (
                      <span className="text-green-500 text-lg font-semibold">
                        Completed
                      </span>
                    ) : (
                      <span className="text-yellow-500 text-lg font-semibold">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-xl">Loading match details...</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Matches;
