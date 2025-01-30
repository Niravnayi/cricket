import React, { useState } from 'react';
import axiosClient from '@/utils/axiosClient';
import BattingStatsComponent from './battingStatsComponent';
import { MatchDetails } from './types/matchDetails';

const CombinedComponent: React.FC<{ matchDetails: MatchDetails }> = ({ matchDetails }) => {
  const [strikerIndex, setStrikerIndex] = useState(0);
  const [nonStrikerIndex, setNonStrikerIndex] = useState(1);
  const [extras, setExtras] = useState({
    byes: 0,
    legByes: 0,
    wides: 0,
    noBalls: 0,
    total: 0
  });
  const handleStrikeChange = () => {
    setStrikerIndex(prev => (prev === 0 ? 1 : 0));
    setNonStrikerIndex(prev => (prev === 1 ? 0 : 1));
  };

  const handleAddExtra = (type: keyof typeof extras) => {
    setExtras(prev => {
      const newExtras = { 
        ...prev, 
        [type]: prev[type] + 1,
        total: prev.total + 1
      };
      return newExtras;
    });
  };

  const handleClearExtras = () => {
    setExtras({ byes: 0, legByes: 0, wides: 0, noBalls: 0, total: 0 });
  };
console.log(matchDetails)
  const handleSaveAll = async () => {
    try {
        if(matchDetails.scorecard?.extras?.length > 0){
            const extrasId=matchDetails?.scorecard?.extras[0].extrasId
      await axiosClient.put(`/extras/${extrasId}`, {
        scorecardId: matchDetails.scorecard?.scorecardId,
        teamId: matchDetails.secondTeamId,
        byes: extras.byes,
        legByes: extras.legByes,
        wides: extras.wides,
        noBalls: extras.noBalls,
        totalExtras: extras.total,
      });
    }
    else{
        await axiosClient.post('/extras', {
            scorecardId: matchDetails.scorecard?.scorecardId,
            teamId: matchDetails.secondTeamId,
            byes: extras.byes,
            legByes: extras.legByes,
            wides: extras.wides,
            noBalls: extras.noBalls,
            totalExtras: extras.total,
          });
    }
      // Handle strike change based on total extras
      if (extras.total % 2 !== 0) {
        handleStrikeChange();
      }

      // Update match state with current striker positions
    //   await axiosClient.put(`/matches/${matchDetails.matchId}/state`, {
    //     batter1Id: matchDetails.scorecard?.battingStats?.[strikerIndex]?.playerId,
    //     batter2Id: matchDetails.scorecard?.battingStats?.[nonStrikerIndex]?.playerId,
    //     strikerIndex,
    //     nonStrikerIndex
    //   });

      console.log('All changes saved successfully');
      
      // Clear extras after save
      handleClearExtras();

    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  return (
    <div className="match-interface">
      <BattingStatsComponent 
        matchDetails={matchDetails}
        strikerIndex={strikerIndex}
        nonStrikerIndex={nonStrikerIndex}
        onStrikeChange={handleStrikeChange}
      />

      <div className="control-panel p-6 bg-gray-100 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-semibold">Add Extras</h4>
          <div className="flex gap-2">
            <button
              onClick={handleSaveAll}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save All
            </button>
            <button
              onClick={handleClearExtras}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {Object.entries(extras).map(([key, value]) => {
            if (key === 'total') return null;
            return (
              <div key={key} className="flex flex-col">
                <label className="text-lg capitalize">{key}</label>
                <button
                  onClick={() => handleAddExtra(key as keyof typeof extras)}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add {key}
                </button>
                <span className="mt-2 text-lg">Count: {value}</span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total Extras: {extras.total}</span>
        </div>
      </div>
    </div>
  );
};

export default CombinedComponent;