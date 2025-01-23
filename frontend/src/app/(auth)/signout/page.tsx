"use client";
import axiosClient from '@/utils/axiosClient';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await axiosClient.post('/signout');
            router.push('/signin'); 
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
            Sign Out
        </button>
    );
}
