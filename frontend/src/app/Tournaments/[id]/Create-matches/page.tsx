import MatchForm from "@/components/Dashboard/MatchForm";

export default function CreateMatchPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Create Match</h1>
      <MatchForm tournamentId={params.id} />
    </div>
  );
}
