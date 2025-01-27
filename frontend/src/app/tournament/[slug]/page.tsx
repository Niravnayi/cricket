"use client";
import React from "react";
import TournamentMatches from "@/components/Organizer/Tournament/tournamentMatches";

export default function Tournament() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 to-gray-300 p-8">
      <TournamentMatches />
    </div>
  );
}