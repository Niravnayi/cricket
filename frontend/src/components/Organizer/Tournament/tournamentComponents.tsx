"use client";
import React from "react";
import { useTournamentDetails } from "@/Hooks/useTournamentData";
import TournamentDialog from "./tournamentDialog";
import TournamentRender from "./tournamentRender";

export default function TournamentComponent() {

  const {
    error,
  } = useTournamentDetails();


  if (error) {
    return <p className="text-red-500 text-center mt-8">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 to-gray-300 p-8">
      <TournamentDialog/>

      <TournamentRender />

    </div>
  );
}
