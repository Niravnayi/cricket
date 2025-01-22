import React from 'react'
import { MatchDetails } from './types/matches'
const ScorePanel: React.FC<{ matchDetails: MatchDetails }> = ({ matchDetails }) => {

  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-blue-900">
          {matchDetails.firstTeamName}
        </h3>
        <p className="text-lg text-gray-700">
          {matchDetails.scorecard.teamAScore}/
          {matchDetails.scorecard.teamAWickets}
        </p>
        <p className="text-sm text-gray-500">
          Overs: {matchDetails.scorecard.teamAOvers}
        </p>
      </div>

      <div className="text-center">
        <h3 className="text-xl font-semibold text-blue-900">
          {matchDetails.secondTeamName}
        </h3>
        <p className="text-lg text-gray-700">
          {matchDetails.scorecard.teamBScore}/
          {matchDetails.scorecard.teamBWickets}
        </p>
        <p className="text-sm text-gray-500">
          Overs: {matchDetails.scorecard.teamBOvers}
        </p>
      </div>
    </div>
  )
}

export default ScorePanel