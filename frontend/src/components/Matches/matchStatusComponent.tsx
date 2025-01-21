import React from 'react'
import { matchDetails } from './types/matchDetails'
const MatchStatusComponent = ({matchDetails}:matchDetails) => {
  return (
    <div>
        <div className="flex justify-between items-center p-6 border-t border-gray-200">
                  <div className="text-center">
                    {matchDetails.isLive ? (
                      <span className="text-red-500 text-lg font-semibold">
                        LIVE
                      </span>
                    ) : matchDetails.isCompleted ? (
                      <span className="text-green-500 text-lg font-semibold">
                        Completed
                      </span>
                    ) : (
                      <span className="text-yellow-500 text-lg font-semibold">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
    </div>
  )
}

export default MatchStatusComponent