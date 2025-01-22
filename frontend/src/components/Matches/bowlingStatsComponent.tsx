import React from 'react'
import { matchDetails } from './types/matchDetails'
const BowlingStatsComponent = ({ matchDetails }: matchDetails) => {
    return (


        <div className="grid grid-cols-2 gap-6 mt-6">
            <div>
                <h3 className="text-lg font-semibold text-red-900">
                    Bowling Stats - {matchDetails.firstTeamName}
                </h3>
                {matchDetails.scorecard.bowlingStats
                    .filter(
                        (player) =>
                            player.teamName === matchDetails.firstTeamName
                    )
                    .map((player) => (
                        <div
                            key={player.playerName}
                            className="flex justify-between text-sm text-gray-600"
                        >
                            <span>{player.playerName}</span>
                            <span>
                                {player.overs} overs, {player.wickets} wickets
                            </span>
                            <span>
                                Economy: {player.runsConceded}/{player.overs}
                            </span>
                        </div>
                    ))}
            </div>

            <div>
                <h3 className="text-lg font-semibold text-red-900">
                    Bowling Stats - {matchDetails.secondTeamName}
                </h3>
                {matchDetails.scorecard.bowlingStats
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
                                {player.overs} overs, {player.wickets} wickets
                            </span>
                            <span>
                                Economy: {player.runsConceded / player.overs}
                            </span>
                        </div>
                    ))}
            </div>
        </div>

    )
}

export default BowlingStatsComponent