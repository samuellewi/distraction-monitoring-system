"use client";

import TeamOverview from "@/components/teams/TeamOverview";
import Leaderboard from "@/components/teams/Leaderboard";
import MemberList from "@/components/teams/MemberList";
import Preferences from "@/components/teams/Preferences";

export default function TeamsPage() {
  return (
    <div className="p-6 space-y-6">

      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-semibold">Teams</h1>
        <p className="text-sm text-gray-500">
          Collaborate and track productivity together
        </p>
      </div>

      {/* MEMBERS */}
      <MemberList />

      {/* STATS */}
      <div className="grid grid-cols-2 gap-6">
        <Leaderboard />
        <TeamOverview />
      </div>

      {/* MEMBERS */}
      

      {/* BOTTOM */}
        <Preferences />

    </div>
  );
}