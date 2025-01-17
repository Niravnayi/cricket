"use client"; // Mark this file as a client component if using hooks like usePathname

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation"; // Import usePathname for route detection
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import logo from "../../public/download.png";

const Footer: React.FC = () => {
  const pathname = usePathname(); // Get the current route

  // List of routes where the Footer should be hidden
  const hideFooterRoutes = ["/login", "/signup"];

  // Do not render the Footer on specific routes
  if (hideFooterRoutes.includes(pathname)) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8">
          {/* Logo */}
          <div>
            <Link href="/">
              <Image src={logo} alt="MatchLive" className="w-auto h-20" />
            </Link>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-blue-500 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/matches"
                  className="hover:text-blue-500 transition"
                >
                  Live Matches
                </Link>
              </li>
              <li>
                <Link
                  href="/schedule"
                  className="hover:text-blue-500 transition"
                >
                  Match Schedule
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-500 transition"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About MatchLive</h3>
            <p className="text-gray-400">
              MatchLive is your one-stop platform for live match updates,
              schedules, and breaking news from the world of cricket and beyond.
              Stay connected and never miss a moment.
            </p>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-6">
              <Link
                href="https://twitter.com"
                className="hover:text-blue-500 transition"
                aria-label="Twitter"
              >
                <Twitter />
              </Link>
              <Link
                href="https://facebook.com"
                className="hover:text-blue-700 transition"
                aria-label="Facebook"
              >
                <Facebook />
              </Link>
              <Link
                href="https://instagram.com"
                className="hover:text-pink-500 transition"
                aria-label="Instagram"
              >
                <Instagram />
              </Link>
              <Link
                href="https://linkedin.com"
                className="hover:text-blue-600 transition"
                aria-label="LinkedIn"
              >
                <Linkedin />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} MatchLive. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
