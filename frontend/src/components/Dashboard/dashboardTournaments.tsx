import React, { useState, useRef } from 'react';
import { fetchTournaments, deleteTournament, updateTournament, fetchTeamData, createTournament } from '@/server-actions/tournamentActions'; 
import TournamentCard from '@/components/Dashboard/tournamentCard';
import DashboadForm from '@/components/Dashboard/dashboardForm';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { Team, Tournament } from './types/dashboard';

const DashboardTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentTournament, setCurrentTournament] = useState<Tournament | null>(null);
  const [teamData, setTeamData] = useState<Team[]>([]);
  const hasFetchedData = useRef(false); 

  const fetchTournamentsData = async () => {
    try {
      const tournamentData = await fetchTournaments(1);
      setTournaments(tournamentData);
      console.log('Fetched tournaments:', tournamentData);

      const team = await fetchTeamData();
      setTeamData(team);
    } catch (error) {
      console.error('Error fetching tournaments or team data:', error);
    }
  };

  if (!hasFetchedData.current) {
    fetchTournamentsData();
    hasFetchedData.current = true;
  }

  const handleDelete = async (tournamentId: number) => {
    try {
      await deleteTournament(tournamentId);
      setTournaments(tournaments.filter(tournament => tournament.tournamentId !== tournamentId));
    } catch (error) {
      console.error('Error deleting tournament:', error);
    }
  };

  const handleEdit = (tournament: Tournament) => {
    setCurrentTournament(tournament);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCreateTournament = async (tournament: Tournament) => {
    if (isEditing && currentTournament?.tournamentId) {
      await updateTournament(currentTournament.tournamentId, tournament);
    } else {
      await createTournament(tournament);
    }
    setShowModal(false);
    fetchTournamentsData(); 
  };

  const handleCreateTrigger = () => {
    setIsEditing(false);
    setCurrentTournament(null);
    setShowModal(true);
  };

  return (
    <div>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogTrigger asChild>
          <Button onClick={handleCreateTrigger} className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-[#007f5f]">
            Create Tournament
          </Button>
        </DialogTrigger>

        <DialogContent className="p-8 max-w-lg">
          <DialogTitle className="text-2xl font-semibold mb-4">{isEditing ? "Edit Tournament" : "Create New Tournament"}</DialogTitle>
          <DialogFooter>
            <DashboadForm 
              tournamentData={currentTournament} 
              teamData={teamData} 
              onSubmit={handleCreateTournament}
              onClose={() => setShowModal(false)} 
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <section className="mt-8">
        {tournaments.length > 0 ? (
          tournaments.map((tournament) => (
            <TournamentCard
              key={tournament.tournamentId}
              tournament={tournament}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))
        ) : (
          <p>No tournaments found.</p>
        )}
      </section>
    </div>
  );
};

export default DashboardTournaments;
