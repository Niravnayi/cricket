import React from 'react'
import { useDashboard } from "@/Hooks/useDashboard";
interface tournament{
    tournamentName:string;
}
const DashboardForm = ({tournamentName}:tournament) => {
    const {
        teams,
        teamData,
        setTournamentName,
        handleTeamSelect,
    } = useDashboard();
    console.log(tournamentName)

    return (

        <form>
            <label className="block text-sm font-semibold text-gray-600">
                Tournament Name
            </label>
            <input
                type="text"
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#009270]"
                placeholder="Enter tournament name"
            />
            <label htmlFor="teamSelect" className="block text-sm font-semibold text-gray-600">
                Select Teams
            </label>
            <select
                id="teamSelect"
                onChange={handleTeamSelect}
                className="p-2 w-full border border-gray-300 rounded-md"
            >
                <option value="">Select a Team</option>
                {teamData.map((team) => (
                    <option key={team.teamId} value={team.teamId}>
                        {team.teamName}
                    </option>
                ))}
            </select>
            <ul>
                {teams.map((teamId) => {
                    const team = teamData.find((t) => t.teamId === teamId);
                    return team ? (
                        <li key={teamId}>{team.teamName}</li>
                    ) : null;
                })}
            </ul>
        </form>
    )
}

export default DashboardForm