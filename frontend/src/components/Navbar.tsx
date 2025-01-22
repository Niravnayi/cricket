"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import "../app/globals.css";
import logo from "../../public/nextinnings-high-resolution-logo-transparent.png";
import Image from "next/image";
import { Button } from "./ui/button";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Simulate user data (In real applications, you'd fetch this from context or a global state)
  const user = {
    avatar: "/path/to/avatar.jpg",  // Replace with dynamic path if needed
    username: "John Doe",
    email: "johndoe@example.com"
  };

  useEffect(() => {
    setMenuOpen(true);
  }, []);

  return (
    <nav className="px-[10%] py-5 bg-blue-100 sticky top-0 z-50 text-black shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <Image src={logo} alt="CricketLive" className="w-auto h-10" />
        </Link>

        {/* Links for Desktop */}
        <div className="hidden md:flex space-x-8">
          <Link
            href="/All-Matches"
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

          <Link
            href="/leaderboard"
            className="text-sm md:text-base lg:text-lg font-medium hover:text-black transition duration-300"
          >
            Leaderboard
          </Link>
        </div>

        {/* User Profile (Avatar, Username, Email) for Desktop */}
        {user ? (
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center">
              <Image
                src={user.avatar}
                alt="User Avatar"
                className="w-12 h-12 rounded-full"
                width={48}
                height={48}
              />
              <div className="text-gray-700">
                <p className="font-base">{user.username}</p>
                <p className="text-sm">{user.email}</p>
              </div>
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

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden flex items-center focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden space-y-4 p-4"
          style={{
            animation: menuOpen ? "slideIn 0.5s forwards" : "slideOut 0.5s forwards",
          }}
        >
          <Link
            href="/All-Matches"
            className="block text-sm md:text-base lg:text-lg font-medium hover:text-black transition duration-300"
            onClick={() => {
              setMenuOpen(false);
              document.body.style.overflow = "auto";
            }}
          >
            All Matches
          </Link>
          <Link
            href="/tournament"
            className="block text-sm md:text-base lg:text-lg font-medium hover:text-black transition duration-300"
            onClick={() => {
              setMenuOpen(false);
              document.body.style.overflow = "auto";
            }}
          >
            Tournament
          </Link>
          <Link
            href="/leaderboard"
            className="block text-sm md:text-base lg:text-lg font-medium hover:text-black transition duration-300"
            onClick={() => {
              setMenuOpen(false);
              document.body.style.overflow = "auto";
            }}
          >
            Leaderboard
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <Image
                src={user.avatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
                width={40}
                height={40}
              />
              <div className="text-sm">
                <p className="font-medium">{user.username}</p>
                <p className="text-xs">{user.email}</p>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="block text-sm md:text-base lg:text-lg font-medium text-blue-500 bg-white px-7 py-3 w-fit rounded-full hover:bg-blue-600 transition duration-300"
              onClick={() => {
                setMenuOpen(false);
                document.body.style.overflow = "auto";
              }}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
