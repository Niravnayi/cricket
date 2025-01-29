"use client";
import Link from "next/link";
import "../app/globals.css";
import logo from "../../public/nextinnings-high-resolution-logo-transparent.png";
import Image from "next/image";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SignOutButton from "@/app/(auth)/signout/page";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const pathname = usePathname();
  const user = {
    avatar: "",
    username: "John Doe",
    email: "johndoe@example.com",
  };

  if (pathname === "/signin" || pathname === "/signup") {
    return null;
  }

  return (
    <nav className="px-4 sm:px-[5%] lg:px-[10%] py-5 bg-blue-100 sticky top-0 z-50 text-black shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <Image src={logo} alt="CricketLive" className="w-auto h-10" />
        </Link>

        {/* Links for Desktop */}
        <div className="hidden md:flex space-x-8">
          <Link
            href="/matches"
            className="text-sm md:text-base lg:text-lg font-medium hover:text-black transition duration-300"
          >
            All Matches
          </Link>

          <Link
            href="/tournament"
            className="text-sm md:text-base lg:text-lg font-medium hover:text-black transition duration-300"
          >
            Tournament
          </Link>
        </div>

        {/* User Profile for Desktop */}
        {user ? (
          <div className="hidden md:flex items-center space-x-4">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt="User Avatar"
                className="w-12 h-12 rounded-full"
                width={48}
                height={48}
              />
            ) : (
              <FaUserCircle className="w-12 h-12 text-gray-500" />
            )}
            <div className="text-gray-700">
              <p className="font-base">{user.username}</p>
              <p className="text-sm">{user.email}</p>
            </div>
            <div>
              <SignOutButton />
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center">
            <Link href="/login">
              <Button className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition duration-300">
                Login
              </Button>
            </Link>
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <Sheet>
          <SheetTrigger>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 md:hidden"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Select an option to navigate.</SheetDescription>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <Link
                href="/all-matches"
                className="block text-sm md:text-base lg:text-lg font-medium hover:text-black transition duration-300"
              >
                All Matches
              </Link>
              <Link
                href="/tournament"
                className="block text-sm md:text-base lg:text-lg font-medium hover:text-black transition duration-300"
              >
                Tournament
              </Link>

              {user ? (
                <div className="flex items-center space-x-4">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <FaUserCircle className="w-10 h-10 text-gray-500" />
                  )}
                  <div className="text-sm">
                    <p className="font-medium">{user.username}</p>
                    <p className="text-xs">{user.email}</p>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block text-sm md:text-base lg:text-lg font-medium text-blue-500 bg-white px-7 py-3 w-fit rounded-full hover:bg-blue-600 transition duration-300"
                >
                  Login
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;