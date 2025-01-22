import React from 'react'
import { matchDetails } from './types/matchDetails'
const MatchInfo = ({matchDetails}:matchDetails) => {
  return (
    
           <div className="bg-green-600 text-white p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {matchDetails.firstTeamName} vs{" "}
                        {matchDetails.secondTeamName}
                      </h2>
                      <p className="text-sm">{matchDetails.venue}</p>
                      <p className="text-sm">
                        {new Date(matchDetails.dateTime).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-xl font-semibold ${
                          matchDetails.isLive ? "text-red-500" : "text-gray-300"
                        }`}
                      >
                        {matchDetails.isLive ? "LIVE" : matchDetails.result}
                      </p>
                    </div>
                  </div>
                </div>
  )
}

export default MatchInfo