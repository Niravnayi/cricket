import React, { useState, useEffect } from 'react';
import axiosClient from '@/utils/axiosClient';
import BattingStatsComponent from './battingStatsComponent';
import { MatchDetails } from './types/matchDetails';
import { getBattingStats } from '@/server-actions/battingStatsActions';
import socket from '@/utils/socket';

const CombinedComponent: React.FC<{ matchDetails: MatchDetails }> = ({ matchDetails }) => {
  const [strikerIndex, setStrikerIndex] = useState(0);
  const [nonStrikerIndex, setNonStrikerIndex] = useState(1);
  const [extras, setExtras] = useState({ byes: 0, legByes: 0, wides: 0, noBalls: 0, total: 0 });

  // Calculate extra balls (byes and legByes count as valid deliveries)


  const handleStrikeChange = () => {
    setStrikerIndex((prev) => (prev === 0 ? 1 : 0));
    setNonStrikerIndex((prev) => (prev === 1 ? 0 : 1));
  };
  const handleSelectExtra = (type: keyof typeof extras, value: number) => {
    const updatedExtras = {
      byes: 0,
      legByes: 0,
      wides: 0,
      noBalls: 0,
      [type]: value, // Only one type is selected at a time
      total: value,  // Total will be equal to the selected value
    };
    setExtras(updatedExtras);
  };

  const handleClearExtras = () => {
    setExtras({ byes: 0, legByes: 0, wides: 0, noBalls: 0, total: 0 });
  };

  const handleSaveAll = async () => {
    try {
      if (matchDetails.scorecard?.extras?.length > 0) {
        const extrasId = matchDetails.scorecard.extras[0].extrasId;
        const existingExtras = matchDetails.scorecard.extras[0];

        const updatedExtras = {
          byes: (existingExtras.byes ?? 0) + extras.byes,
          legByes: (existingExtras.legByes ?? 0) + extras.legByes,
          wides: (existingExtras.wides ?? 0) + extras.wides,
          noBalls: (existingExtras.noBalls ?? 0) + extras.noBalls,
          totalExtras: (existingExtras.totalExtras ?? 0) + extras.total,
        };
        console.log(updatedExtras)
        await axiosClient.put(`/extras/${extrasId}`, {
          scorecardId: matchDetails.scorecard?.scorecardId,
          teamId: matchDetails.secondTeamId,
          ...updatedExtras,
        });

        socket.emit('extrasUpdate', { 
          scorecardId: matchDetails.scorecard?.scorecardId, 
          id: extrasId, 
          teamId: matchDetails.secondTeamId, 
          ...updatedExtras 
        });
      } else {
        await axiosClient.post('/extras', {
          scorecardId: matchDetails.scorecard?.scorecardId,
          teamId: matchDetails.secondTeamId,
          ...extras,
        });
      }

      await getBattingStats();

      if (extras.total % 2 !== 0) {
        handleStrikeChange();
      }

      console.log('All changes saved successfully');
      handleClearExtras();
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  useEffect(() => {
    const handleTeamUpdate = (data) => {
      console.log('Batting stats update received:', data);
    };

    socket.on('teamUpdate', handleTeamUpdate);
    return () => {
      socket.off('teamUpdate', handleTeamUpdate);
    };
  }, []);

  return (
    <div className="match-interface p-6 bg-gray-100 rounded-lg shadow-lg">
      <BattingStatsComponent matchDetails={matchDetails} strikerIndex={strikerIndex} nonStrikerIndex={nonStrikerIndex} onStrikeChange={handleStrikeChange} />

      <div className="p-4 bg-white rounded-lg shadow-md mt-4">
        <h4 className="text-xl font-semibold mb-4">Add Extras</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {['byes', 'legByes', 'wides', 'noBalls'].map((type) => (
            <div key={type} className="flex flex-col items-center">
              <span className="text-lg capitalize">{type}</span>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleSelectExtra(type as keyof typeof extras, num)}
                    className={`px-3 py-1 rounded-lg text-white ${
                      extras[type as keyof typeof extras] === num ? 'bg-blue-600' : 'bg-gray-400 hover:bg-blue-500'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-semibold">Total Extras: {extras.total}</span>
          <div className="flex gap-2">
            <button onClick={handleSaveAll} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Save All</button>
            <button onClick={handleClearExtras} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Clear</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedComponent;
