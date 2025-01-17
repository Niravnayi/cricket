"use client"; // Mark this file as a client component

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

const NavbarWrapper: React.FC = () => {
  const pathname = usePathname();
  const hideNavbarRoutes = ["/login", "/signup"];

  return !hideNavbarRoutes.includes(pathname) ? <Navbar /> : null;
};

export default NavbarWrapper;
