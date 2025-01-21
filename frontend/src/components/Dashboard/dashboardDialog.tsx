// import { useDashboard } from '@/Hooks/useDashboard';
// import React from 'react';
// import {
//     Dialog,
//     DialogTrigger,
//     DialogContent,
//     DialogTitle,
//     DialogDescription,
//     DialogFooter,
//   } from "@/components/ui/dialog";
//   import { Button } from "@/components/ui/button";
// import DashboardForm from '../Forms/dashboardForm';

// const DashboardDialog = ({tournamentName,isEditing}) => {
//     const {
//         showModal,
//         isEditing,
//         setShowModal,
//         handleCreateTournament,
//       } = useDashboard();
//       console.log(showModal)
    
//   return (
//     <div>
//          <Dialog open={showModal} onOpenChange={setShowModal}>
//           <DialogTrigger asChild>
//             <Button className="px-6 py-2 bg-[#009270] text-white rounded-md hover:bg-[#007f5f]">
//               Create Tournament
//             </Button>
//           </DialogTrigger>

//           <DialogContent className="p-8 max-w-lg">
//             <DialogTitle className="text-2xl font-semibold mb-4">
//               {isEditing ? "Edit Tournament" : "Create New Tournament"}
//             </DialogTitle>
//             <DialogDescription className="mb-6 text-gray-700">
//               Please fill in the tournament details.
//             </DialogDescription>
//             <div className="space-y-4">

//               <DashboardForm tournamentName={tournamentName}/>


//             </div>
//             <DialogFooter>
//               <Button
//                 variant="secondary"
//                 onClick={() => setShowModal(false)}
//                 className="px-6 py-2"
//               >
//                 Close
//               </Button>
//               <Button
//                 onClick={handleCreateTournament}
//                 className="px-6 py-2 bg-[#009270] text-white rounded-md hover:bg-[#007f5f]"
//               >
//                 {isEditing ? "Update Tournament" : "Create Tournament"}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//     </div>
//   )
// }

// export default DashboardDialog