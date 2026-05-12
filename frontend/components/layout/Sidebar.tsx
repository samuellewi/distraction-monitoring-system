"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const path = usePathname();
  const [tracking, setTracking] = useState(false);

  const menu = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "/icons/finance.svg",
    },
    {
      name: "App Classification",
      href: "/categories",
      icon: "/icons/settings_applications.svg",
    },
    {
      name: "Activity",
      href: "/tracker",
      icon: "/icons/browse_activity.svg",
    },
    {
      name: "Report",
      href: "/report",
      icon: "/icons/assignment.svg",
    },
    {
      name: "Teams",
      href: "/teams",
      icon: "/icons/groups.svg",
    },
  ];

  return (
    <div className="h-full bg-white border-r  border-gray-200 flex flex-col justify-between p-5">

      {/* TOP */}
      <div>
        {/* LOGO + BRAND */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Image
            src="/icons/logo.svg"
            alt="logo"
            width={24}
            height={24}
          />
          <h1 className="font-semibold text-lg">FocusInsight</h1>
        </div>

        {/* MENU */}
        <div className="space-y-2">
          <button
            onClick={() => setTracking(!tracking)}
            className={`group w-full mb-5 py-2 rounded-xl flex items-center justify-between px-4 transition-all duration-200
              ${tracking
                ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                : "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"}
              hover:-translate-y-0.5 hover:shadow-md
            `}>

            <span className="font-medium">
              {tracking ? "Stop" : "Start"}
            </span>

            <div
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200
                ${tracking ? "bg-red-500" : "bg-green-500"}
                group-hover:scale-110
              `}>

              <img
                src={tracking ? "/icons/stop.svg" : "/icons/play_arrow.svg"}
                className="w-5 h-5 transition-transform duration-200 group-hover:rotate-120"
              />
            </div>
          </button>


          {menu.map((item) => {
            const active = path === item.href;
              return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200
                    ${
                      active
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                  `}
                >
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={18}
                    height={18}
                    className={`transition duration-200 ${
                      active ? "scale-110 opacity-100" : "opacity-70 group-hover:opacity-100"
                    }`}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* BOTTOM USER */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-blue-500 text-white flex items-center justify-center rounded-full text-sm">
            B
          </div>
          <div>
            <p className="text-sm font-medium">Brian</p>
            <p className="text-xs text-gray-400">Active User</p>
          </div>
        </div>

        <button className="w-full text-sm text-red-500 bg-red-50 py-2 rounded-lg hover:bg-red-100 transition">
          Logout
        </button>
      </div>
    </div>
  );
}