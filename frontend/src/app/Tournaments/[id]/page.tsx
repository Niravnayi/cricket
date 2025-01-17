import { fetchTournamentById, fetchMatchesByTournament } from "@/services/api";
import Table from "@/components/Dashboard/Table";

export default async function TournamentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: tournament } = await fetchTournamentById(params.id);
  const { data: matches } = await fetchMatchesByTournament(params.id);

  return (
    <div>
      <h1 className="text-2xl font-bold">{tournament.name}</h1>
      <p>{tournament.description}</p>
      <h2 className="text-xl font-semibold">Matches</h2>
      <Table
        headers={["Team A", "Team B", "Date", "Time", "Venue"]}
        data={matches}
      />
    </div>
  );
}
