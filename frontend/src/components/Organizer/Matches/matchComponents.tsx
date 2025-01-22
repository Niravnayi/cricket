import React from 'react';
import { useOrganizerMatches } from '@/Hooks/useOrganizerMatches';
const MatchComponents = () => {
    const {
        match,
        editing,
        updatedStats,
        handleEditClick,
        handleChange,
        handleSave,
    } = useOrganizerMatches()
    return (
        <div>
            <main className="max-w-7xl mx-auto px-6 py-8">
        {match ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Batting Stats - {match.firstTeamName}
            </h2>
            {match.scorecard.battingStats.map((player) => (
              <div key={player.playerName} className="mb-4">
                <span>{player.playerName}</span>
                {editing[player.playerName] ? (
                  <form onSubmit={handleSave(player.playerName)}>
                    <input
                      type="number"
                      value={updatedStats[player.playerName]?.runs ?? player.runs}
                      onChange={(e) => handleChange(e, player.playerName, 'runs')}
                      className="border rounded px-2"
                      placeholder="Enter runs"
                    />
                    <button type="submit" className="ml-2 bg-blue-500 text-white px-2 py-1 rounded">
                      Save
                    </button>
                  </form>
                ) : (
                  <>
                    <span>{player.runs} runs</span>
                    <button
                      onClick={() => handleEditClick(player.playerName)}
                      className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>Loading match details...</p>
        )}
      </main>
        </div>
    )
}

export default MatchComponents