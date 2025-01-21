import { useTournamentDetails } from '@/Hooks/useTournamentData'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

const TournamentRender = () => {
    const{
        tournament,
        activeTab,
        scheduledMatches,
        liveMatches,
        setActiveTab,
        completedMatches,
        renderMatches
    } = useTournamentDetails()
  return (
    <div>
         <div className="rounded-full z-10 px-[10%]">
        <div className="flex justify-center space-x-4">
          <button
            className={`px-4 py-2 ${activeTab === "live"
              ? "bg-gray-700 text-white"
              : "bg-gray-200 text-gray-700"
            } rounded-lg shadow-md`}
            onClick={() => setActiveTab("live")}
          >
            Live Matches
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "scheduled"
              ? "bg-gray-700 text-white"
              : "bg-gray-200 text-gray-700"
            } rounded-lg shadow-md`}
            onClick={() => setActiveTab("scheduled")}
          >
            Scheduled Matches
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "completed"
              ? "bg-gray-700 text-white"
              : "bg-gray-200 text-gray-700"
            } rounded-lg shadow-md`}
            onClick={() => setActiveTab("completed")}
          >
            Completed Matches
          </button>
        </div>
      </div>
      <div className="pt-24 w-full max-w-6xl mx-auto space-y-12">
        <AnimatePresence mode="popLayout">
          {tournament && (
            <motion.div
              key={tournament.tournamentId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="border rounded-lg shadow-lg overflow-hidden bg-gray-200"
            >
              {activeTab === "live" && (
                <div className="p-6 bg-gray-300">
                  <h4 className="text-xl font-bold text-gray-800">
                    Live Matches:
                  </h4>
                  {renderMatches(liveMatches)}
                </div>
              )}
              {activeTab === "scheduled" && (
                <div className="p-6 bg-gray-300">
                  <h4 className="text-xl font-bold text-gray-800">
                    Scheduled Matches:
                  </h4>
                  {renderMatches(scheduledMatches)}
                </div>
              )}
              {activeTab === "completed" && (
                <div className="p-6 bg-gray-300">
                  <h4 className="text-xl font-bold text-gray-800">
                    Completed Matches:
                  </h4>
                  {renderMatches(completedMatches)}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default TournamentRender