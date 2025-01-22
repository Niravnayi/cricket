import React from 'react'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useTournamentDetails } from '@/Hooks/useTournamentData';
import OrganizerTounamentForm from '@/components/Forms/organizerTounamentForm';

const TournamentDialog = () => {
    
    const {
        selectedMatch,
        showModal,
        setShowModal,
    } = useTournamentDetails()
    console.log(showModal)

    return (
        <div>
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogTrigger asChild>
                    <Button  className="px-6 py-2 bg-[#009270] text-white rounded-md hover:bg-[#007f5f]">
                        Create Match
                    </Button>
                </DialogTrigger>
                <DialogContent className="dialog-content p-8 max-w-lg">
                    <DialogTitle className="text-2xl font-semibold mb-4">
                        {selectedMatch ? "Edit Match" : "Create New Match"}
                    </DialogTitle>
                    <DialogDescription className="mb-6 text-gray-700">
                        {selectedMatch ? "Edit the match details." : "Select the teams for the match."}
                    </DialogDescription>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between space-x-4">

                            <OrganizerTounamentForm />

                        </div>
                    </div>
                    <DialogFooter className="mt-6 flex justify-end space-x-4">
                        <Button
                            variant="secondary"
                            onClick={() => setShowModal(false)}
                            className="px-6 py-2"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default TournamentDialog