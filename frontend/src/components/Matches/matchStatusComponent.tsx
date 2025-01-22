import React from 'react'
import { MatchDetails } from './types/matchDetails'
const MatchStatusComponent : React.FC<{ matchDetails: MatchDetails }> = ({ matchDetails }) =>{ 
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