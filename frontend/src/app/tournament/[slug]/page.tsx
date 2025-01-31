"use client";
import React from "react";
import TournamentMatches from "@/components/Organizer/Tournament/TournamentMatches";
import { useParams } from "next/navigation";

export default function Tournament() {
   const params = useParams()
    const tournamentId = params?.slug ? Number(params.slug) : 0
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 to-gray-300 p-8">
      <TournamentMatches tournamentId={tournamentId}/>
    </div>
  );
}