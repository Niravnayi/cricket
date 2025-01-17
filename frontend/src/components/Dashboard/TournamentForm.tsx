"use client";

import { useForm } from "react-hook-form";
import { createTournament } from "@/services/api";

export default function TournamentForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await createTournament(data);
      alert("Tournament created successfully!");
    } catch (error) {
      console.error("Error creating tournament:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("name")} placeholder="Tournament Name" className="input" />
      <input {...register("startDate")} type="date" className="input" />
      <input {...register("endDate")} type="date" className="input" />
      <textarea {...register("description")} placeholder="Description" className="input" />
      <button type="submit" className="btn">Create Tournament</button>
    </form>
  );
}
