import { useDashboard } from '@/Hooks/useDashboard';
import Link from 'next/link'
import React, { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '../ui/button';
import DashboardForm from '../Forms/dashboardForm';


const DashboardTournaments = () => {
  const [isEditing,setIsEditing] = useState(true)
    const {
        tournaments,                                                
        handleDelete,     
        tournamentName,
        handleEdit,
        showModal,
        setShowModal,
        handleCreateTournament,
      } = useDashboard();


  return (
    <div>
        <section className="mb-8">
          {tournaments.length > 0 ? (
            tournaments.map((tournament) => (
              <>
              <Link key={tournament.tournamentId} href={`/organizer/tournament/${tournament.tournamentId}`}>
                <div
                  key={tournament.tournamentId}
                  className="bg-white shadow-lg rounded-lg overflow-hidden mb-6"
                >
                  <div className="bg-[#009270] text-white p-10 hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <h2 className="text-2xl font-bold">
                      {tournament.tournamentName}
                    </h2>
                    <p className="text-sm">
                      Organizer ID: {tournament.organizerId}
                    </p>
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-white">Teams:</h3>
                      {tournament.teams.map((team) => (
                        <p key={team.id} className="text-sm text-gray-300">
                          {team.team.teamName}
                        </p>
                      ))}
                      
                    </div>
                  </div>
                </div>
              </Link>
              <div className="flex justify-between">
              <button
                className="p-2 mt-5 w-24 text-white bg-red-600 hover:bg-red-700 transition-all"
                onClick={() => handleDelete(tournament.tournamentId)}
              >
                Delete
              </button>

              <Button
                className="p-2 mt-5 w-24 text-black bg-blue-500 hover:bg-blue-600 transition-all"
                onClick={() => {handleEdit(tournament); setIsEditing(true);}}
              >
                Edit
              </Button>

     
            </div>
            </>
            ))
          ) : (
            <p>No tournaments found.</p>
          )}
        </section>
        <Dialog open={showModal} onOpenChange={setShowModal}>
          
          <DialogTrigger asChild>
            <Button onClick={()=>{setIsEditing(false)}} className="px-6 py-2 bg-[#009270] text-white rounded-md hover:bg-[#007f5f]">
              Create Tournament
            </Button>
          </DialogTrigger>

          <DialogContent className="p-8 max-w-lg">
            <DialogTitle className="text-2xl font-semibold mb-4">
              {isEditing ? "Edit Tournament" : "Create New Tournament"}
            </DialogTitle>
            <DialogDescription className="mb-6 text-gray-700">
              Please fill in the tournament details.
            </DialogDescription>
            <div className="space-y-4">
            {isEditing? <DashboardForm tournamentName={tournamentName}/>:<DashboardForm  tournamentName=""/>}
            </div>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                className="px-6 py-2"
              >
                Close
              </Button>
              <Button
                onClick={handleCreateTournament}
                className="px-6 py-2 bg-[#009270] text-white rounded-md hover:bg-[#007f5f]"
              >
                {isEditing ? "Update Tournament" : "Create Tournament"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

    </div>
  )
}

export default DashboardTournaments