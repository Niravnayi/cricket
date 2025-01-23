import { useTournaments } from '@/Hooks/useTournaments'
import Link from 'next/link'
import React from 'react'
import AnimatedArrow from './animatedArrow'

const TournamentComponent = () => {

    const{tournaments} = useTournaments()
  return (
    <div>
        
      <ul className="space-y-6 flex flex-col w-full ">
        {tournaments.map((tournament) => (
          <Link
            key={tournament.tournamentId}
            href={`/tournament/${tournament.tournamentId}`}
          >
            <li className="p-6 border rounded-lg bg-white shadow-md group transform transition-all hover:shadow-2xl hover:-translate-y-3 hover:bg-indigo-50">
              <div className="relative">
                {/* Tournament Name */}
                <h2 className="text-3xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                  {tournament.tournamentName}
                </h2>
                {/* Organizer ID */}
                <p className="text-gray-600 mt-2 text-sm">
                  Organizer ID: {tournament.organizerId}
                </p>
              </div>

              {/* Teams Section */}
              <h3 className="text-lg font-semibold mt-4 text-indigo-700">
                Teams:
              </h3>
              <ul className="list-disc list-inside mt-2 text-gray-700 group-hover:text-gray-900">
                {tournament.teams && tournament.teams.map((team) => (
                  <li
                    key={team.teamId}
                    className="transition-transform duration-200 transform group-hover:translate-x-2"
                  >
                    {team.team.teamName}
                  </li>
                ))}
              </ul>

              {/* Animated Arrow */}
              <AnimatedArrow />
            </li>
          </Link>
        ))}
      </ul>
    </div>
  )
}

export default TournamentComponent