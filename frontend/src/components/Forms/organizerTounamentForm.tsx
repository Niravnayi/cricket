import { useTournamentDetails } from '@/Hooks/useTournamentData'
import React from 'react'
import { Input } from '../ui/input'

const OrganizerTounamentForm = () => {

    const{
        teamA,
        setTeamA,
        teamB,
        setTeamB,
        venue,
        setVenue,
        date,
        setDate,
        teams
    } = useTournamentDetails()
    return (
        <div>
            <form>
                <div className="w-1/2">

                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                        Team A
                    </label>
                    <select
                        title="Select Team A"
                        value={teamA}
                        onChange={(e) => setTeamA(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="" disabled>
                            Select Team A
                        </option>
                        {teams && teams.map((team) => (
                            <option key={team.teamId} value={team.teamName}>
                                {team.teamName}
                            </option>
                        ))}
                    </select>

                </div>

                <div className="text-lg font-bold text-gray-600">Vs</div>
                <div className="w-1/2">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                        Team B
                    </label>
                    <select
                        title="Select Team B"
                        value={teamB}
                        onChange={(e) => setTeamB(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="" disabled>
                            Select Team B
                        </option>
                        {teams && teams.map((team) => (
                            <option key={team.teamId} value={team.teamName}>
                                {team.teamName}
                            </option>
                        ))}
                    </select>
                    <Input type="text" placeholder="Enter Venue" className="p-3 mt-3" onChange={(e) => setVenue(e.target.value)} value={venue} />
                    <Input type="datetime-local" placeholder="Enter Date" className="p-3 mt-3" onChange={(e) => setDate(e.target.value)} value={date} />
                </div>
            </form>

        </div>
    )
}

export default OrganizerTounamentForm