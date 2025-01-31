'use client'
import MatchComponents from '@/components/Organizer/Matches/MatchComponents';
import { useParams } from 'next/navigation';

const Matches = () => {
  const params = useParams()
  const id = params?.slug ? Number(params.slug) : undefined
  
  
  return (
    <div className="bg-gray-100 min-h-screen">
      {id && <MatchComponents id={id} />}
    </div>
  );
};

export default Matches;
