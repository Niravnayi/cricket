import { useMatchData } from '@/Hooks/useFetchMatches ';
import React from 'react';
import MatchInfo from './matchInfo';
import ScorePanel from './scorePanel';
import BattingStatsComponent from './battingStatsComponent';
import BowlingStatsComponent from './bowlingStatsComponent';
import MatchStatusComponent from './matchStatusComponent';

const MatchComponents = () => {
    const { match } = useMatchData();
    return (
        <div>
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Live Matches</h2>
                {match.length > 0 ? (
                    match.map((matchDetails) => (
                        <div
                            key={matchDetails.matchId}
                            className="bg-white shadow-lg rounded-lg overflow-hidden mb-6"
                        >
                            {/* Match Information */}

                            <MatchInfo matchDetails={matchDetails} />

                            {/* Score Panel */}

                            <ScorePanel matchDetails={matchDetails} />

                            {/* Batting Stats */}

                            <BattingStatsComponent matchDetails={matchDetails} />

                            {/* Bowling Stats */}

                            <BowlingStatsComponent matchDetails={matchDetails} />

                            {/* Match Status */}

                            <MatchStatusComponent matchDetails={matchDetails} />
                            
                        </div>
                    ))
                ) : (
                    <p className="text-center text-xl">Loading match details...</p>
                )}
            </section>
        </div>
    )
}

export default MatchComponents