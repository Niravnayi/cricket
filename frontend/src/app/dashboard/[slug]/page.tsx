"use client";
import React from "react";
import DashboardTournaments from "@/components/Dashboard/dashboardTournaments";

const Dashboard = () => {

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        <DashboardTournaments/>
        
      </main>
    </div>
  );

};

export default Dashboard;
