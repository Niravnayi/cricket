"use client";
import { useParams } from "next/navigation";

const matchDetails = {
  "4th Match, ODI": {
    tournament: "Asia Cup 2023",
    teams: ["Bangladesh", "Afghanistan"],
    scores: ["334-5 (50)", "230 (34.2)"],
    result: "Bangladesh won by 104 runs",
    status: "Completed",
  },
  "18th Match, T20": {
    tournament: "IPL 2023",
    teams: ["MI", "RCB"],
    scores: ["186-7 (20)", "188-3 (19.3)"],
    result: "RCB won by 7 wickets",
    status: "Completed",
  },
  "19th Match, T20": {
    tournament: "IPL 2023",
    teams: ["DC", "KKR"],
    scores: ["196-8 (20)", "176-10 (18.2)"],
    result: "Delhi Capitals won by 2 runs",
    status: "Completed",
  },
  // Add other matches as needed
};

export default function MatchDetails() {
  const { slug } = useParams(); // Access dynamic route params using useParams

  const match = matchDetails[slug]; // Access the match details using the slug

  if (!match) {
    return <div>Match not found</div>; // Return an error message if the match doesn't exist
  }

  return (
    <div className="container mx-auto px-[10%] py-8">
      <h1 className="text-xl font-bold">
        {match.tournament} • {slug}
      </h1>
      <div className="mt-6">
        <p>
          <strong>Teams:</strong> {match.teams[0]} vs {match.teams[1]}
        </p>
        <p>
          <strong>Scores:</strong> {match.scores[0]} vs {match.scores[1]}
        </p>
        <p>
          <strong>Result:</strong> {match.result}
        </p>
        <p>
          <strong>Status:</strong> {match.status}
        </p>
      </div>
    </div>
  );
}
