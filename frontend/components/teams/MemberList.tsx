import { useState } from "react";

const initialMembers = [
  {
    name: "Brian",
    role: "Team Leader",
    online: true,
    lastActive: "Now",
  },
  {
    name: "Farel",
    role: "UI Designer",
    online: false,
    lastActive: "10 min ago",
  },
  {
    name: "Bryan",
    role: "Backend Dev",
    online: true,
    lastActive: "Now",
  },
  {
    name: "Febri",
    role: "Frontend Dev",
    online: false,
    lastActive: "1h ago",
  },
  {
    name: "Hugo",
    role: "Frontend Dev",
    online: false,
    lastActive: "1h ago",
  },
  {
    name: "Fabian",
    role: "Backend Dev",
    online: false,
    lastActive: "1h ago",
  },
];

export default function MemberList() {

  const [members, setMembers] = useState(initialMembers);
  const [newMember, setNewMember] = useState("");

  return (
    <div className="bg-white border rounded-2xl p-5">
      
      {/* TITLE */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold">
            Members
          </h2>

          <p className="text-sm text-gray-500">
            Team productivity overview
          </p>
        </div>

        <span className="text-sm text-gray-400">
          {members.length} members
        </span>
      </div>

      {/* INVITE MEMBER */}
      <div className="flex gap-3 mb-5">

        <input
          type="text"
          placeholder="Search username..."
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2 outline-none"
        />

        <button
          onClick={() => {
            if (!newMember.trim()) return;

            setMembers([
              ...members,
              {
                name: newMember,
                role: "New Member",
                online: false,
                lastActive: "Invited",
              },
            ]);

            setNewMember("");
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          Invite
        </button>

      </div>

      {/* LIST */}
      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
        {members.map((member) => (
          <div
            key={member.name}
            className="border rounded-xl px-3 py-2 hover:shadow-md transition"
          >

            {/* TOP */}
            <div className="flex items-center justify-between">

              {/* LEFT */}
              <div className="flex items-center gap-3">

                {/* AVATAR */}
                <div className="w-11 h-11 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium">
                  {member.name[0]}
                </div>

                {/* INFO */}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {member.name}
                    </p>

                    {/* ONLINE */}
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        member.online
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                  </div>

                  <p className="text-xs text-gray-500">
                    {member.role}
                  </p>
                </div>

              </div>

              {/* RIGHT */}
              <div className="text-right">
                <p className="text-xs text-gray-400">
                  {member.lastActive}
                </p>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}