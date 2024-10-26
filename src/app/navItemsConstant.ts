import { IoGrid, IoStorefront, IoList, IoSearch } from "react-icons/io5";
import {
  FaUserFriends,
  FaVials,
  FaUniversity,
  FaBuilding,
  FaThList,
  FaSave,
  FaWpforms,
  FaHistory,
  FaSearch,
} from "react-icons/fa";
import { AiFillExperiment } from "react-icons/ai";

export const NAV_ITEMS = {
  admin: [
    { href: "/admin", icon: IoGrid, label: "Dashboard" },
    { href: "/admin/user_roles", icon: FaUserFriends, label: "User Roles" },
    { href: "/admin/chemicals", icon: FaVials, label: "Chemicals" },
    { href: "/admin/institutes", icon: FaUniversity, label: "Institutes" },
    { href: "/admin/research_centres", icon: FaBuilding, label: "Research Centres" },
    { href: "/admin/laboratories", icon: AiFillExperiment, label: "Laboratories" },
    { href: "/admin/storages", icon: IoStorefront, label: "Storages" },
  ],
  researcher: [
    { href: "/researcher", icon: IoGrid, label: "Dashboard" },
    { href: "/researcher/new_request", icon: FaWpforms, label: "Make Request" },
    { href: "/researcher/view_requests", icon: FaHistory, label: "Previous Requests" },
    { href: "/researcher/search_chemicals", icon: FaSearch, label: "Search for Chemicals" },
  ],
  supervisor: [
    { href: "/supervisor", icon: IoGrid, label: "Dashboard" },
    { href: "/supervisor/view_requests", icon: IoList, label: "View Requests" },
  ],
  approver: [
    { href: "/approver", icon: IoGrid, label: "Dashboard" },
    { href: "/approver/view_requests", icon: IoList, label: "View Requests" },
  ],
  storage: [
    { href: "/storage", icon: IoGrid, label: "Dashboard" },
    { href: "/storage/search_chemicals", icon: IoSearch, label: "Search for Chemicals" },
    { href: "/storage/view_location_list", icon: FaThList, label: "View Storage Location List" },
    { href: "/storage/record_chemicals", icon: FaSave, label: "Record Chemicals" },
    { href: "/storage/view_requests", icon: IoList, label: "View Requests" },
  ],
};
