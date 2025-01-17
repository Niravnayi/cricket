'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import rahana from '../../../../public/Rahane.webp'

interface Tournament {
  tournamentId: string;
  tournamentName: string;
  firstTeamName: string;
  secondTeamName: string;
}

export default function Home() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const params = useParams();
  const id = params?.id; // Ensure the key matches your dynamic route segment
  console.log(id);
  
  useEffect(() => {
    async function fetchData() {
      if (id) {
        try {
          const response = await axios.get(`http://localhost:4000/matches/tournaments/${id}`);
          console.log(response.data);
          setTournaments(response.data);
        } catch (error) {
          console.error('Error fetching tournaments:', error);
        }
      }
    }
    fetchData();
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-8">
      <div className="w-full max-w-6xl place-items-center space-y-8">
        {tournaments.map(tournament => (
          <div key={tournament.tournamentId} className="border rounded-lg shadow-lg overflow-hidden bg-gray-800 w-[800px]">
            <div className="w-full h-64 mb-40 place-items-center">
              <Image
                src={rahana}
                alt={tournament.tournamentName}
                width={800}
                height={600}
                className="place-items-center"
              />
            </div>
            <div className="p-4 place-items-center bg-black w-full z-20">
              <h2 className="text-2xl font-bold text-white">{tournament.firstTeamName}</h2>
              <h1 className="text-2xl font-bold text-white">VS</h1>
              <h2 className="text-2xl font-bold text-white">{tournament.secondTeamName}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
