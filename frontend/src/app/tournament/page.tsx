"use client";
import React from "react";
import Link from "next/link";
import { useTournaments } from "@/Hooks/useTournaments";

export default function Home() {
  const { tournaments, error } = useTournaments();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 px-[10%] py-5">
      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">
        Tournaments
      </h1>

      {error && <p className="text-red-500 text-center mb-6">{error}</p>}

      <ul className="space-y-6 flex flex-col w-full ">
        {tournaments.map((tournament) => (
          <Link
            key={tournament.tournamentId}
            href={`/tournament/${tournament.tournamentId}`}
          >
            <li className="p-6 border rounded-lg bg-white shadow-md group transform transition-all hover:shadow-2xl hover:-translate-y-3 hover:bg-indigo-50">
              <div className="relative">
                {/* Tournament Name */}
                <h2 className="text-3xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                  {tournament.tournamentName}
                </h2>
                {/* Organizer ID */}
                <p className="text-gray-600 mt-2 text-sm">
                  Organizer ID: {tournament.organizerId}
                </p>
              </div>

              {/* Teams Section */}
              <h3 className="text-lg font-semibold mt-4 text-indigo-700">
                Teams:
              </h3>
              <ul className="list-disc list-inside mt-2 text-gray-700 group-hover:text-gray-900">
                {tournament.teams.map((team) => (
                  <li
                    key={team.teamId}
                    className="transition-transform duration-200 transform group-hover:translate-x-2"
                  >
                    {team.team.teamName}
                  </li>
                ))}
              </ul>

              {/* Animated Arrow */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6 text-indigo-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
