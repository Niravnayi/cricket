<<<<<<< Updated upstream

export default function Home() {
  return (
    <>
      <h1>home page</h1>
    </>
=======
'use client'

import { LoginForm } from "@/components/LoginForm";
import login from '../../public/lords.jpg'
import Image from 'next/image';

// // Define TypeScript interface for tournaments
// interface Tournament {
//   tournamentId: string;
//   tournamentName: string;
// }

export default function Home() {
  


  return (
    <div className="relative min-h-[100vh] flex bg-black items-center justify-center">
    <Image
      src={login}
      alt="Background Image"
      layout="fill"
      objectFit="cover"
      className="absolute opacity-50 inset-0 z-0 dark:brightness-[0.2] dark:grayscale"
    />
    <div className="relative z-10  bg-white dark:bg-black/50 p-6 md:p-10 rounded-lg shadow-lg max-w-md w-full">
      <LoginForm />
    </div>
  </div>
>>>>>>> Stashed changes
  );
}
