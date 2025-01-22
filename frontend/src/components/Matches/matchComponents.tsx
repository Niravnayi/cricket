import React from 'react';
import { fetchMatchById } from '../../server-actions/matchesActions';
import MatchInfo from '@/components/Matches/matchInfo';
import ScorePanel from '@/components/Matches/scorePanel';
import BattingStatsComponent from '@/components/Matches/battingStatsComponent';
import BowlingStatsComponent from '@/components/Matches/bowlingStatsComponent';
import MatchStatusComponent from '@/components/Matches/matchStatusComponent';

interface MatchPageProps {
        id: number; 
}
const MatchPage : React.FC<MatchPageProps> = async ({ id }: MatchPageProps) => {

    try {
        const matchDetails = await fetchMatchById(id);

        return (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <MatchInfo matchDetails={matchDetails} />
                <ScorePanel matchDetails={matchDetails} />
                <BattingStatsComponent matchDetails={matchDetails} />
                <BowlingStatsComponent matchDetails={matchDetails} />
                <MatchStatusComponent matchDetails={matchDetails} />
            </div>
        );
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';

        return (
            <div className="text-center">
                <h2 className="text-2xl font-semibold">Failed to Load Match Details</h2>
                <p>{errorMessage}</p>
            </div>
        );
    }
};

export default MatchPage;
