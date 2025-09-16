import { NavLink } from "react-router-dom";
import clsx from "clsx";

export default function SidebarItem({
  path,
  name,
  Icon,
  isOpen,
  activeBorder = true,
  onClick,
}) {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        clsx(
          "group relative flex items-center px-3 py-2 rounded transition-colors duration-200 ease-in-out",
          "hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400",
          isActive
            ? clsx(
                "bg-gray-700 text-blue-400",
                activeBorder && "border-l-4 border-blue-400"
              )
            : "text-gray-300"
        )
      }
    >
      {/* Icon */}
      <Icon className="w-5 h-5" aria-hidden="true" />

      {/* Text when sidebar is expanded */}
      {isOpen && <span className="ml-3">{name}</span>}

      {/* Tooltip when sidebar is collapsed */}
      {!isOpen && (
        <span
          role="tooltip"
          className="absolute left-full top-1/2 -translate-y-1/2 ml-2
          bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap
          opacity-0 group-hover:opacity-100 transition-all z-50 shadow-lg"
        >
          {name}
        </span>
      )}
    </NavLink>
  );
}