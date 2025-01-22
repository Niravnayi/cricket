// DashboardTournaments.tsx
import React, { useState } from 'react';
import { fetchTournaments, deleteTournament, updateTournament, fetchTeamData, createTournament } from '@/server-actions/tournamentActions'; 
import { Tournament } from '@/Types/tournament';
import TournamentCard from '@/components/Dashboard/tournamentCard';
import TournamentForm from '@/components/Forms/dashboardForm';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { Team } from '@/Types/team';

const DashboardTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentTournament, setCurrentTournament] = useState<Tournament | null>(null);
  const [teamData, setTeamData] = useState<Team[]>([]);

  // Fetch tournaments and team data
  const fetchTournamentsData = async () => {
    try {
      const tournamentData = await fetchTournaments(1);
      setTournaments(tournamentData);

      const team = await fetchTeamData();
      setTeamData(team);
    } catch (error) {
      console.error('Error fetching tournaments or team data:', error);
    }
    
  };
  fetchTournamentsData()
  // Handle tournament deletion
  const handleDelete = async (tournamentId: number) => {
    try {
      await deleteTournament(tournamentId);
      setTournaments(tournaments.filter(tournament => tournament.tournamentId !== tournamentId));
    } catch (error) {
      console.error('Error deleting tournament:', error);
    }
  };

  // Handle tournament editing
  const handleEdit = (tournament: Tournament) => {
    setCurrentTournament(tournament);
    setIsEditing(true);
    setShowModal(true);
  };

  // Handle tournament creation and updating
  const handleCreateTournament = async (tournament: Tournament) => {
    if (isEditing && currentTournament?.tournamentId) {
      await updateTournament(currentTournament.tournamentId, tournament);
    } else {
      await createTournament(tournament);
    }
    setShowModal(false);
    fetchTournamentsData();  // Re-fetch tournaments after creating/updating
  };

  // Modal trigger for creating a tournament
  const handleCreateTrigger = () => {
    setIsEditing(false);
    setCurrentTournament(null);
    setShowModal(true);
  };
console.log(tournaments)
  return (
    <div>
      <section className="mb-8">
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

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogTrigger asChild>
          <Button onClick={handleCreateTrigger} className="px-6 py-2 bg-[#009270] text-white rounded-md hover:bg-[#007f5f]">
            Create Tournament
          </Button>
        </DialogTrigger>

        <DialogContent className="p-8 max-w-lg">
          <DialogTitle className="text-2xl font-semibold mb-4">{isEditing ? "Edit Tournament" : "Create New Tournament"}</DialogTitle>
          <DialogFooter>
             <TournamentForm 
              tournamentData={currentTournament} 
              teamData={teamData} 
              onSubmit={handleCreateTournament} 
            />
            
            <Button variant="secondary" onClick={() => setShowModal(false)} className="px-6 py-2">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardTournaments;
