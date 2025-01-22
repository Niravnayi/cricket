// Matches.tsx
"use client";
import MatchComponents from "@/components/Matches/matchComponents";
import React from "react";
import { useParams } from "next/navigation";
const Matches = () => {
  const params = useParams();
  const id = params?.slug ? Number(params.slug) : undefined;


  return (

    <div className="bg-gray-100 min-h-screen">
      <main className="max-w-7xl mx-auto px-6 py-8">
       {id && <MatchComponents id={id}/>}
      </main>
    </div>

  );
};

export default Matches;
