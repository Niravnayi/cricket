"use client";
import React from "react";
import TournamentComponent from "@/components/Tournament/TournamentComponent";

export default function Tournaments() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 px-[10%] py-5">

      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">
        Tournaments
      </h1>
      <TournamentComponent />
      
    </div>
  );
}