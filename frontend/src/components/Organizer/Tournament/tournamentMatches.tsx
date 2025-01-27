import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Match } from "@/components/Organizer/Tournament/types/tournamentType";
import { fetchTournamentMatches } from "@/server-actions/organizer/specificMatchAction"; 

const TournamentMatches = () => {
  const [tournamentMatches, setTournamentMatches] = useState<Match[] | null>(null);
  const [activeTab, setActiveTab] = useState<"live" | "scheduled" | "completed">("live");


  const tournamentId = "42"; 

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await fetchTournamentMatches(Number(tournamentId)); 
        if (response && response) {
          setTournamentMatches(response); 
        } else {

        }
      } catch (err) {
       console.log(err)
      }
    };
    fetchTournament();
  }, [tournamentId]);

  const liveMatches = tournamentMatches?.filter((match) => match.isLive) || [];
  const scheduledMatches = tournamentMatches?.filter(
    (match) => !match.isLive && !match.isCompleted
  ) || [];
  const completedMatches = tournamentMatches?.filter((match) => match.isCompleted) || [];

  const renderMatches = (matches: Match[]) => (
    <ul className="space-y-6 mt-4">
      {matches.map((match, index) => (
        <div key={index}>
          <Link href={`/matches/${match.matchId}`} className="space-y-14">
            <li className="p-6 border rounded-lg bg-gray-100 shadow-md group transform transition-all hover:shadow-xl hover:-translate-y-2">
              <h5 className="text-2xl font-bold text-gray-800 group-hover:text-gray-600">
                {match.firstTeamName} vs {match.secondTeamName}
              </h5>
              <p className="text-gray-600 mt-2">Venue: {match.venue}</p>
              <p className="text-gray-600">
                Date: {new Date(match.dateTime).toLocaleString()}
              </p>
              {match.result && <p className="text-gray-600">Result: {match.result}</p>}
              <div className="mt-4">
                {match.isLive ? (
                  <span className="px-4 py-2 bg-green-200 text-green-800 rounded-full text-sm animate-pulse">
                    Live
                  </span>
                ) : (
                  <span className="px-4 py-2 bg-red-200 text-red-800 rounded-full text-sm">
                    Not Live
                  </span>
                )}
                {match.isCompleted && (
                  <span className="px-4 py-2 bg-blue-200 text-blue-800 rounded-full text-sm ml-2">
                    Completed
                  </span>
                )}
              </div>
            </li>
          </Link>
        </div>
      ))}
    </ul>
  );

  return (
    <div>
      <div className="rounded-full z-10 px-[10%]">
        <div className="flex justify-center space-x-4">
          <button
            className={`px-4 py-2 ${activeTab === "live" ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700"} rounded-lg shadow-md`}
            onClick={() => setActiveTab("live")}
          >
            Live Matches
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "scheduled" ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700"} rounded-lg shadow-md`}
            onClick={() => setActiveTab("scheduled")}
          >
            Scheduled Matches
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "completed" ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700"} rounded-lg shadow-md`}
            onClick={() => setActiveTab("completed")}
          >
            Completed Matches
          </button>
        </div>
      </div>
      <div className="pt-24 w-full max-w-6xl mx-auto space-y-12">
        <AnimatePresence mode="popLayout">
          {tournamentMatches && tournamentMatches.length > 0 && (
            <motion.div
              key={tournamentMatches[0].tournamentId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="border rounded-lg shadow-lg overflow-hidden bg-gray-200"
            >
              {activeTab === "live" && (
                <div className="p-6 bg-gray-300">
                  <h4 className="text-xl font-bold text-gray-800">Live Matches:</h4>
                  {renderMatches(liveMatches)}
                </div>
              )}
              {activeTab === "scheduled" && (
                <div className="p-6 bg-gray-300">
                  <h4 className="text-xl font-bold text-gray-800">Scheduled Matches:</h4>
                  {renderMatches(scheduledMatches)}
                </div>
              )}
              {activeTab === "completed" && (
                <div className="p-6 bg-gray-300">
                  <h4 className="text-xl font-bold text-gray-800">Completed Matches:</h4>
                  {renderMatches(completedMatches)}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TournamentMatches;