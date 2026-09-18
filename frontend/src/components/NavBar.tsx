import React from "react";
import { NavLink } from "react-router-dom";
import { Camera, AlertCircle, Moon, User } from "lucide-react";

export const NavBar: React.FC = () => {
  const navItems = [
    { to: "/track", label: "Track", icon: Camera },
    { to: "/weak-spots", label: "Weak spots", icon: AlertCircle },
    { to: "/tonights-plan", label: "Tonight's plan", icon: Moon },
    { to: "/profile", label: "Profile", icon: User },
  ];

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r border-[#E4E2DD] bg-[#FAFAF9] min-h-screen p-6 shrink-0 select-none">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-[#26314D]">
            <span className="font-heading font-bold text-xl tracking-tight">QuestionMark</span>
          </div>
          <p className="text-xs text-[#5C6470] mt-1">JEE diagnostic tool</p>
        </div>

        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                    isActive
                      ? "bg-[#26314D] text-white font-medium"
                      : "text-[#5C6470] hover:text-[#14171C] hover:bg-[#FFFFFF]"
                  }`
                }
              >
                <Icon className="w-4 h-4 stroke-[1.75]" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-[#E4E2DD]">
          <p className="text-xs text-[#5C6470] leading-relaxed">
            Targeting errors, not volume.
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF] border-t border-[#E4E2DD] px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 text-xs transition-colors ${
                  isActive
                    ? "text-[#26314D] font-medium"
                    : "text-[#5C6470] hover:text-[#14171C]"
                }`
              }
            >
              <Icon className="w-4 h-4 mb-0.5 stroke-[1.75]" />
              <span className="text-[11px] leading-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
};
