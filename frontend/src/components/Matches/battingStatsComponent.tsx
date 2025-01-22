import React from 'react'
import { MatchDetails } from './types/matchDetails'
const BattingStatsComponent: React.FC<{ matchDetails: MatchDetails }> = ({ matchDetails }) => {

  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      <div>
        <h3 className="text-lg font-semibold text-blue-900">
          Batting Stats - {matchDetails.firstTeamName}
        </h3>
        {matchDetails.scorecard.battingStats
          .filter(
            (player) =>
              player.teamName === matchDetails.firstTeamName
          )
          .map((player) => (
            <div
              key={player.playerName}
              className="flex justify-around  text-sm text-gray-600"
            >
              <span>{player.playerName}</span>
              <span>
                {`${player.runs} runs (${player.balls} balls)`}
              </span>
              <span>
                SR: {(player.runs / player.balls) * 100}
              </span>
            </div>
          ))}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-blue-900">
          Batting Stats - {matchDetails.secondTeamName}
        </h3>
        {matchDetails.scorecard.battingStats
          .filter(
            (player) =>
              player.teamName === matchDetails.secondTeamName
          )
          .map((player) => (
            <div
              key={player.playerName}
              className="flex justify-between text-sm text-gray-600"
            >
              <span>{player.playerName}</span>
              <span>
                {player.runs} runs ({player.balls} balls)
              </span>
              <span>
                SR: {(player.runs / player.balls) * 100}
              </span>
            </div>
          ))}
      </div>
    </div>
  )
}

export default BattingStatsComponent