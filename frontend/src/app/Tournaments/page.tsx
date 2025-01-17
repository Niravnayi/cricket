import { fetchTournaments } from "@/services/api";
import Table from "../../components/Dashboard/Table";

export default async function TournamentPage() {
  const { data: tournaments } = await fetchTournaments();

  return (
    <div>
      <h1 className="text-2xl font-bold">Tournaments</h1>
      <Table
        headers={["Name", "Start Date", "End Date", "Description"]}
        data={tournaments}
      />
    </div>
  );
}
