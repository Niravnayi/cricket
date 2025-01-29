'use client'; 

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosClient from "@/utils/axiosClient";
import { BattingStats, MatchDetails } from '@/app/organizer/matches/types/matchType';
import { fetchMatchById } from '@/server-actions/matchesActions';

interface Id {
  id: number;
}

const MatchPage = ({ id }: Id) => {
  const [match, setMatch] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ [key: string]: boolean }>({});
  const [updatedStats, setUpdatedStats] = useState<{ [key: string]: Partial<BattingStats> }>({});
  const router = useRouter();

  const fetchData = async () => {
    const matchData = await fetchMatchById(id);
    setMatch(matchData);
    setLoading(false); 
  };

  if (loading) {
    fetchData();  
    return <span className='loader'></span>; 
  }

  if (!match) {
    return <p>Match details not found.</p>;  
  }

  const handleEditClick = (playerName: string) => {
    setEditing((prev) => ({ ...prev, [playerName]: !prev[playerName] }));

    if (!updatedStats[playerName]) {
      setUpdatedStats((prev) => ({
        ...prev,
        [playerName]: {
          runs: match?.scorecard.battingStats.find((player) => player.playerName === playerName)?.runs || 0,
          balls: match?.scorecard.battingStats.find((player) => player.playerName === playerName)?.balls || 0,
          fours: match?.scorecard.battingStats.find((player) => player.playerName === playerName)?.fours || 0,
          sixes: match?.scorecard.battingStats.find((player) => player.playerName === playerName)?.sixes || 0,
          strikeRate: match?.scorecard.battingStats.find((player) => player.playerName === playerName)?.strikeRate || 0,
          dismissal: match?.scorecard.battingStats.find((player) => player.playerName === playerName)?.dismissal || '',
        },
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, playerName: string, field: keyof BattingStats) => {
    setUpdatedStats((prev) => ({
      ...prev,
      [playerName]: {
        ...prev[playerName],
        [field]: Number(e.target.value),
      },
    }));
  };
  const handleSave = async (playerName: string) => {
    const updatedPlayerStats = updatedStats[playerName];
  
    if (!updatedPlayerStats) {
      console.error('No stats available to save for', playerName);
      return;
    }
  
    const player = match.scorecard.battingStats.find((player) => player.playerName === playerName);

    if (!player) {
      console.error(`Player with name ${playerName} not found`);
      return;
    }
  
    try {
      await axiosClient.put(`/batting-stats/${match.scorecard.scorecardId}`, {
        scorecardId: match.scorecard.scorecardId,   
        playerId: player.playerId,                   
        teamId: match.firstTeamId,                 
        runs: updatedPlayerStats.runs,              
        balls: updatedPlayerStats.balls || 0,       
        fours: updatedPlayerStats.fours || 0,       
        sixes: updatedPlayerStats.sixes || 0,       
        strikeRate: updatedPlayerStats.strikeRate || 0, 
        dismissal: updatedPlayerStats.dismissal || '',  
      });
  
      router.refresh();
      setEditing((prev) => ({ ...prev, [playerName]: false }));
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  return (
    <div>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-xl font-semibold mb-4">Batting Stats - {match.firstTeamName}</h2>
        {match.scorecard.battingStats.map((player) => (
          <div key={player.playerName} className="mb-4">
            <span>{player.playerName}</span>
            {editing[player.playerName] ? (
              <form onSubmit={(e) => { e.preventDefault(); handleSave(player.playerName); }}>
                <input
                  type="number"
                  value={updatedStats[player.playerName]?.runs ?? player.runs}
                  onChange={(e) => handleChange(e, player.playerName, 'runs')}
                  className="border rounded px-2"
                  placeholder="Enter runs"
                />
                <input
                  type="number"
                  value={updatedStats[player.playerName]?.balls ?? player.balls}
                  onChange={(e) => handleChange(e, player.playerName, 'balls')}
                  className="border rounded px-2 ml-2"
                  placeholder="Enter balls"
                />
                <input
                  type="number"
                  value={updatedStats[player.playerName]?.fours ?? player.fours}
                  onChange={(e) => handleChange(e, player.playerName, 'fours')}
                  className="border rounded px-2 ml-2"
                  placeholder="Enter fours"
                />
                <input
                  type="number"
                  value={updatedStats[player.playerName]?.sixes ?? player.sixes}
                  onChange={(e) => handleChange(e, player.playerName, 'sixes')}
                  className="border rounded px-2 ml-2"
                  placeholder="Enter sixes"
                />
                <input
                  type="number"
                  value={updatedStats[player.playerName]?.strikeRate ?? player.strikeRate}
                  onChange={(e) => handleChange(e, player.playerName, 'strikeRate')}
                  className="border rounded px-2 ml-2"
                  placeholder="Enter strike rate"
                />
                <input
                  type="text"
                  value={updatedStats[player.playerName]?.dismissal ?? player.dismissal}
                  onChange={(e) => handleChange(e, player.playerName, 'dismissal')}
                  className="border rounded px-2 ml-2"
                  placeholder="Enter dismissal"
                />
                <button type="submit" className="ml-2 bg-blue-500 text-white px-2 py-1 rounded">
                  Save
                </button>
              </form>
            ) : (
              <>
                <span>{player.runs} runs</span>
                <button onClick={() => handleEditClick(player.playerName)} className="ml-2 bg-green-500 text-white px-2 py-1 rounded">
                  Edit
                </button>
              </>
            )}
          </div>
        ))}
      </main>
    </div>
  );
};

export default MatchPage;
