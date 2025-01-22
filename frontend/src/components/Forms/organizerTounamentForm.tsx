import { useTournamentDetails } from '@/Hooks/useTournamentData';
import React, { useState } from 'react';
import { Input } from '../ui/input';

const OrganizerTounamentForm = () => {
    const {
        teamA,
        setTeamA,
        teamB,
        setTeamB,
        venue,
        setVenue,
        date,
        setDate,
        teams,
        handleCreateMatch 
    } = useTournamentDetails();

    const [error, setError] = useState('');

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log(teamA)
        if (!teamA || !teamB || !venue || !date) {
            setError('Please fill out all fields before submitting.');
            return;
        }

        setError('');

        try {
            await handleCreateMatch({ teamA, teamB, venue, date });
            alert('Match created successfully!');
        } catch (error) {
            // Handle API errors
            console.error('Failed to create match:', error);
            setError('Failed to create match. Please try again.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="w-full">
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
                <div className="w-full">
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

                    <Input
                        type="text"
                        placeholder="Enter Venue"
                        className="p-3 mt-3"
                        onChange={(e) => setVenue(e.target.value)}
                        value={venue}
                    />

                    <Input
                        type="datetime-local"
                        placeholder="Enter Date"
                        className="p-3 mt-3"
                        onChange={(e) => setDate(e.target.value)}
                        value={date}
                    />
                </div>

                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

                <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded-md">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default OrganizerTounamentForm;
