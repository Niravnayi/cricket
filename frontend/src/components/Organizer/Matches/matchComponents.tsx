// MatchPage.tsx
'use client'; // Ensure this component is client-side

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosClient from "@/utils/axiosClient";
import { BattingStats, MatchDetails } from '@/app/organizer/matches/types/matchType';
import { fetchMatchDetails } from '@/server-actions/organizerMatchActions'; 
import { fetchTeamData } from '@/server-actions/organizer/TournamentActions';
import { Team } from '@/components/Matches/types/matchDetails';

interface Id {
  id: number;
}

const MatchPage = ({ id }: Id) => {
  const [match, setMatch] = useState<MatchDetails | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ [key: string]: boolean }>({});
  const [updatedStats, setUpdatedStats] = useState<{ [key: string]: Partial<BattingStats> }>({});
  const router = useRouter();

  // Call the async function directly and set the match data once it is fetched
  const fetchData = async () => {
    const matchData = await fetchMatchDetails(id.toString());
    const teamData = await fetchTeamData();
    setMatch(matchData);
    setTeam(teamData);
    setLoading(false);  // Set loading state to false after data is fetched
  };

  if (loading) {
    fetchData();  // Call the data fetching function when the component renders
    return <span className='loader'></span>;  // Show loading text while fetching
  }

  if (!match) {
    return <p>Match details not found.</p>;  // Handle no data case
  }

  const handleEditClick = (playerName: string) => {
    setEditing((prev) => ({ ...prev, [playerName]: !prev[playerName] }));

    // Initialize player stats with current values if editing starts
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
        [field]: Number(e.target.value),  // Update only the changed field
      },
    }));
  };
  const handleSave = async (playerName: string) => {
    const updatedPlayerStats = updatedStats[playerName];
    console.log(updatedPlayerStats); // Log to check the updated player stats
    console.log(match);
  
    if (!updatedPlayerStats) {
      console.error('No stats available to save for', playerName);
      return;
    }
  
    // Find the player object by playerName to extract playerId
    console.log(team)
    const player = match.scorecard.battingStats.find((player) => player.playerName === playerName);
    console.log(player)
    console.log(updatedPlayerStats)
    if (!player) {
      console.error(`Player with name ${playerName} not found`);
      return;
    }
  
    try {
      await axiosClient.put(`/batting-stats/${match.scorecard.scorecardId}`, {
        scorecardId: match.scorecard.scorecardId,   // Make sure scorecardId is sent
        playerId: player.playerId,                   // Use playerId instead of playerName
        teamId: match.firstTeamId,                   // Make sure teamId is sent
        runs: updatedPlayerStats.runs,              // Make sure runs are included
        balls: updatedPlayerStats.balls || 0,       // Default to 0 if balls are not available
        fours: updatedPlayerStats.fours || 0,       // Default to 0 if fours are not available
        sixes: updatedPlayerStats.sixes || 0,       // Default to 0 if sixes are not available
        strikeRate: updatedPlayerStats.strikeRate || 0,  // Default to 0 if strikeRate is not available
        dismissal: updatedPlayerStats.dismissal || '',  // Default to empty string if dismissal is not available
      });
  
      router.refresh();
      setEditing((prev) => ({ ...prev, [playerName]: false }));
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };
  

  console.log(match);

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
