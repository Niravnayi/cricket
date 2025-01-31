import React, { useEffect, useState } from 'react';
import socket from '@/utils/socket';
import axiosClient from '@/utils/axiosClient';
import { MatchDetails, Scorecard, BowlingStats } from '@/components/Matches/types/matchDetails';
import { getBowlingStats } from '@/server-actions/bowlingStatsAction';
import { getScoreCardbyId } from '@/server-actions/scorecardActions';

const BowlingStatsComponent: React.FC<{ matchDetails: MatchDetails }> = ({ matchDetails }) => {
  const [editingBowler] = useState<BowlingStats | null>(null);
  const [pendingWickets, setPendingWickets] = useState<number>(0);
  const [pendingRunsConceded, setPendingRunsConceded] = useState<number>(0);
  const [scoreCard, setScoreCard] = useState<Scorecard>();

  useEffect(() => {
    async function fetchBowlingStats() {
      try {
        const matchId = matchDetails.matchId;
        const response = await axiosClient.get(`/matches/${matchId}`);

        const matchData = response.data;
        if (matchData.scorecard?.bowlingStats) {
        } 
        else {
          console.warn('No bowling stats found in the fetched match data.');
        }
      } 
      catch (error) {
        console.error('Error fetching initial bowling stats:', error);
      }
    }

    fetchBowlingStats();

    async function getBowling() {
      try {
       await getBowlingStats();
      } 
      catch (error) {
        console.error('Error fetching bowling stats:', error);
      }
    }

    getBowling();

    
    async function fetchScoreCard() {
      if (matchDetails.scorecard?.scorecardId !== undefined) {
        const response = await getScoreCardbyId({ scorecardId: matchDetails.scorecard.scorecardId });
        setScoreCard(response);
      }
    }
  
    fetchScoreCard();
    socket.on('getScoreCard', (data: { scorecard: Scorecard }) => {
      setScoreCard(data.scorecard);
    })

    return () => {
      socket.off('fetchMatch');
    };
  }, [matchDetails]);

  const latestBowler = scoreCard?.bowlingStats?.filter((bowler) => bowler.teamName === matchDetails.firstTeamName || bowler.teamName === matchDetails.secondTeamName).pop();

  return (
    <div className="grid grid-cols-2 gap-6 p-6">
    
      {['firstTeamName', 'secondTeamName'].map((teamKey) => (
        <div key={teamKey} className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4">
            Bowling Stats - {matchDetails[teamKey as 'firstTeamName' | 'secondTeamName']}
          </h3>
          {/* Only display the latest bowler for the respective team */}
          {latestBowler && latestBowler.teamName === matchDetails[teamKey as 'firstTeamName' | 'secondTeamName'] && (
            <div key={latestBowler.playerName} className="flex justify-between items-center mb-4">
              <span className="text-gray-800 font-medium">{latestBowler.playerName}</span>
              <span className="text-gray-600">
                {latestBowler.overs} overs, {latestBowler.wickets} wickets, {latestBowler.runsConceded} runs
              </span>
              <span className="text-gray-500">Economy: {latestBowler.economyRate}</span>
            </div>
          )}
          {editingBowler && editingBowler.teamName === matchDetails[teamKey as 'firstTeamName' | 'secondTeamName'] && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
              <p className="text-sm font-semibold mb-3">
                Editing <span className="text-red-700">{editingBowler.playerName}</span>
              </p>
              <div className="flex gap-2">
                <label className='block mb-2' htmlFor='wickets'>Wickets</label>
                <input
                  name='wickets'
                  type="number"
                  placeholder="Wickets"
                  value={pendingWickets}
                  onChange={(e) => setPendingWickets(Number(e.target.value))}
                  className="px-2 py-1 border rounded"
                />
                <label className='block mb-2' htmlFor='runsConceded'>Runs Conceded</label>
                <input
                  name='runsConceded'
                  type="number"
                  placeholder="Runs Conceded"
                  value={pendingRunsConceded}
                  onChange={(e) => setPendingRunsConceded(Number(e.target.value))}
                  className="px-2 py-1 border rounded"
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

};

export default BowlingStatsComponent;
