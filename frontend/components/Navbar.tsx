'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">🇧🇩</span>
            <span className="text-xl font-bold text-gray-900">ValoMondo.info</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/categories" className="text-gray-700 hover:text-primary-600 transition-colors">
              Categories
            </Link>
            <Link href="/search" className="text-gray-700 hover:text-primary-600 transition-colors">
              Search
            </Link>
            
            {session ? (
              <>
                <Link href="/submit" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Submit Item
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Profile
                </Link>
                {session.user.is_moderator && (
                  <a
                    href="http://localhost:8001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-700 hover:text-primary-800 font-medium transition-colors"
                  >
                    Admin Panel
                  </a>
                )}
                <button
                  onClick={() => signOut()}
                  className="btn btn-secondary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/categories" className="text-gray-700 hover:text-primary-600">
                Categories
              </Link>
              <Link href="/search" className="text-gray-700 hover:text-primary-600">
                Search
              </Link>
              
              {session ? (
                <>
                  <Link href="/submit" className="text-gray-700 hover:text-primary-600">
                    Submit Item
                  </Link>
                  <Link href="/profile" className="text-gray-700 hover:text-primary-600">
                    Profile
                  </Link>
                  {session.user.is_moderator && (
                    <a
                      href="http://localhost:8001"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-700 font-medium"
                    >
                      Admin Panel
                    </a>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="btn btn-secondary text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-primary-600">
                    Login
                  </Link>
                  <Link href="/register" className="btn btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

