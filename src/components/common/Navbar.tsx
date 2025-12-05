'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { signOutUser } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, authUser, loading } = useAuth();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav>
      <div className="brand-container">
        <img
          src="/Assets/WhatsApp Image 2025-09-17 at 15.28.37.jpg"
          alt="Logo"
          style={{ height: '40px', width: 'auto' }}
        />
        <div className="logo">AR VR Club | Computer Engineering Department</div>
      </div>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/#about">About</Link>
        </li>
        <li>
          <Link href="/#team">Team</Link>
        </li>
        <li>
          <Link href="/#contact">Contact</Link>
        </li>
        {loading ? (
          <li>Loading...</li>
        ) : user ? (
          <>
            {authUser?.role === 'admin' ? (
              <li>
                <Link href="/admin" className="btn" style={{ padding: '5px 15px', fontSize: '0.9rem' }}>
                  Admin Dashboard
                </Link>
              </li>
            ) : (
              <li>
                <Link href="/dashboard" className="btn" style={{ padding: '5px 15px', fontSize: '0.9rem' }}>
                  Dashboard
                </Link>
              </li>
            )}
            <li>
              <button onClick={handleSignOut} className="btn-outline" style={{ padding: '5px 15px', fontSize: '0.9rem' }}>
                Sign Out
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link
              href="/login"
              style={{
                color: '#2563eb',
                fontWeight: 'bold',
                border: '2px solid #2563eb',
                padding: '5px 15px',
                borderRadius: '20px',
                transition: 'all 0.3s',
              }}
            >
              Sign In
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

