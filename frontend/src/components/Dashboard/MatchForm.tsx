"use client";

import { useForm } from "react-hook-form";
import { createMatch } from "@/services/api";

export default function MatchForm({ tournamentId }: { tournamentId: string }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await createMatch({ ...data, tournamentId });
      alert("Match created successfully!");
    } catch (error) {
      console.error("Error creating match:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("teamA")} placeholder="Team A" className="input" />
      <input {...register("teamB")} placeholder="Team B" className="input" />
      <input {...register("date")} type="date" className="input" />
      <input {...register("time")} type="time" className="input" />
      <input {...register("venue")} placeholder="Venue" className="input" />
      <button type="submit" className="btn">Create Match</button>
    </form>
  );
}
