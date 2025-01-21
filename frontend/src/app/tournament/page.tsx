"use client";
import React from "react";
import { useTournaments } from "@/Hooks/useTournaments";
import TournamentComponent from "@/components/Tournament/tournamentComponent";

export default function Home() {
  const { error } = useTournaments();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 px-[10%] py-5">
      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">
        Tournaments
      </h1>

      {error && <p className="text-red-500 text-center mb-6">{error}</p>}

      <TournamentComponent/>
    </div>
  );
}
