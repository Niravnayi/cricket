"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import "../app/globals.css";
import logo from "../../public/download.png";
import Image from "next/image";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Set the state to true once the component has mounted on the client
    setMenuOpen(true);
  }, []);

  return (
    <nav className="px-[10%] py-2 bg-gradient-to-t from-blue-500 to-purple-500 sticky top-0 z-50 text-white shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <Image src={logo} alt="CricketLive" className="w-auto  h-20" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8">
          <Link
            href="/All-Matches"
            className="text-sm font-medium hover:text-black transition duration-300"
          >
            All Matches
          </Link>
          <Link
            href="/tournament"
            className="text-sm font-medium hover:text-black transition duration-300"
          >
            Tournament
          </Link>
          <Link
            href="/leaderboard"
            className="text-sm font-medium hover:text-black transition duration-300"
          >
            Leaderboard
          </Link>
        </div>

        {/* Login Button */}
        <div className="hidden md:flex items-center">
          <Link href="/login">
            <button className="btn">
              <div className="wrapper">
                <p className="text">LogIn</p>

                <div className="flower flower1">
                  <div className="petal one"></div>
                  <div className="petal two"></div>
                  <div className="petal three"></div>
                  <div className="petal four"></div>
                </div>
                <div className="flower flower2">
                  <div className="petal one"></div>
                  <div className="petal two"></div>
                  <div className="petal three"></div>
                  <div className="petal four"></div>
                </div>
                <div className="flower flower3">
                  <div className="petal one"></div>
                  <div className="petal two"></div>
                  <div className="petal three"></div>
                  <div className="petal four"></div>
                </div>
                <div className="flower flower4">
                  <div className="petal one"></div>
                  <div className="petal two"></div>
                  <div className="petal three"></div>
                  <div className="petal four"></div>
                </div>
                <div className="flower flower5">
                  <div className="petal one"></div>
                  <div className="petal two"></div>
                  <div className="petal three"></div>
                  <div className="petal four"></div>
                </div>
                <div className="flower flower6">
                  <div className="petal one"></div>
                  <div className="petal two"></div>
                  <div className="petal three"></div>
                  <div className="petal four"></div>
                </div>
              </div>
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
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

      {/* Mobile Menu Links */}
      {menuOpen && (
        <div
          className="md:hidden  space-y-4 p-4"
          style={{
            animation: menuOpen
              ? "slideIn 0.5s forwards"
              : "slideOut 0.5s forwards",
          }}
        >
          <Link
            href="/All-Matches"
            className="block text-sm font-medium hover:text-black transition duration-300"
            onClick={() => {
              setMenuOpen(false);
              document.body.style.overflow = "auto";
            }}
          >
            All Matches
          </Link>
          <Link
            href="/tournament"
            className="block text-sm font-medium hover:text-black transition duration-300"
            onClick={() => {
              setMenuOpen(false);
              document.body.style.overflow = "auto";
            }}
          >
            Tournament
          </Link>
          <Link
            href="/leaderboard"
            className="block text-sm font-medium hover:text-black transition duration-300"
            onClick={() => {
              setMenuOpen(false);
              document.body.style.overflow = "auto";
            }}
          >
            Leaderboard
          </Link>
          <Link
            href="/login"
            className="block text-sm font-medium text-white  bg-black px-7 py-3  w-fit rounded-full hover:bg-purple-500 transition duration-300"
            onClick={() => {
              setMenuOpen(false);
              document.body.style.overflow = "auto";
            }}
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
