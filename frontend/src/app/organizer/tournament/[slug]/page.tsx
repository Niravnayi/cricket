"use client";
import React from "react";
import TournamentComponent from "@/components/Organizer/Tournament/tournamentComponents";
import { useParams } from "next/navigation";

export default function Home() {
    const params = useParams()
    const tournamentId = params?.slug ? Number(params.slug) : 0

  return <TournamentComponent tournamentId={tournamentId} />;
}