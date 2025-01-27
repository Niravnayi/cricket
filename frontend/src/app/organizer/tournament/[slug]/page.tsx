"use client";
import React from "react";
import TournamentComponent from "@/components/Organizer/Tournament/tournamentComponents";

export default function Home() {
  const tournamentId = 42; // Replace with actual tournament ID

  return <TournamentComponent tournamentId={tournamentId} />;
}