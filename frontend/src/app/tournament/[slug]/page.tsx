"use client";
import React from "react";
import TournamentRender from "@/components/Organizer/Tournament/tournamentRender";

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 to-gray-300 p-8">     
     <TournamentRender />

    </div>
  );
}
