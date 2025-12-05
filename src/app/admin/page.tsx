'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/common/Navbar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ChangePasswordModal from '@/components/common/ChangePasswordModal';

export default function AdminDashboard() {
  const { authUser, loading } = useAuth();
  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!authUser) {
        router.push('/login');
      } else if (authUser.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [authUser, loading, router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Loading...</div>
      </>
    );
  }

  if (!authUser || authUser.role !== 'admin') {
    return null;
  }

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
        <AdminSidebar />
        <div style={{ marginLeft: '280px', flex: 1, padding: '2rem', backgroundColor: '#f9fafb', minHeight: 'calc(100vh - 60px)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>👤 Profile</h2>
                <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>Manage your admin account settings</p>
              </div>
              <button
                className="btn-outline"
                onClick={() => setShowPasswordModal(true)}
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
              >
                🔒 Change Password
              </button>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Account Information</h3>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#6b7280', fontSize: '0.9rem' }}>
                    Full Name
                  </label>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '500' }}>
                    {authUser.displayName || 'Not set'}
                  </p>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#6b7280', fontSize: '0.9rem' }}>
                    Email Address
                  </label>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '500' }}>
                    {authUser.email || 'Not set'}
                  </p>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#6b7280', fontSize: '0.9rem' }}>
                    Role
                  </label>
                  <p style={{ margin: 0 }}>
                    <span className="status-badge status-warning" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                      Admin
                    </span>
                  </p>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#6b7280', fontSize: '0.9rem' }}>
                    User ID
                  </label>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280', fontFamily: 'monospace' }}>
                    {authUser.uid}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
}
