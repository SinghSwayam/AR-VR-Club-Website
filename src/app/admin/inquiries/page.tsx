'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/common/Navbar';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'pending' | 'read' | 'replied' | 'resolved';
  created_at: string;
  updated_at: string;
}

export default function InquiriesManagementPage() {
  const { authUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });

  useEffect(() => {
    if (!authLoading) {
      if (!authUser) {
        router.push('/login');
      } else if (authUser.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [authUser, authLoading, router]);

  useEffect(() => {
    if (authUser?.role === 'admin') {
      fetchData();
      
      // Auto-refresh every 30 seconds
      const interval = setInterval(() => {
        fetchData();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [authUser]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/admin/inquiries', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      const data = await response.json();
      if (data.success) {
        setInquiries(data.data);
      } else {
        setError(data.error || 'Failed to load inquiries');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (inquiryId: string, newStatus: Inquiry['status']) => {
    try {
      const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (err: any) {
      alert(`Failed to update status: ${err.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async (inquiryId: string, inquiryName: string) => {
    if (!confirm(`Are you sure you want to delete the inquiry from "${inquiryName}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        alert('Inquiry deleted successfully');
        fetchData();
      } else {
        alert(data.error || 'Failed to delete inquiry');
      }
    } catch (err: any) {
      alert(`Failed to delete inquiry: ${err.message || 'Unknown error'}`);
    }
  };

  // Apply filters
  const filteredInquiries = inquiries.filter((inquiry) => {
    if (filters.status && inquiry.status !== filters.status) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        inquiry.name?.toLowerCase().includes(searchLower) ||
        inquiry.email?.toLowerCase().includes(searchLower) ||
        inquiry.message?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // Get counts
  const pendingCount = inquiries.filter(i => i.status === 'pending').length;
  const totalCount = inquiries.length;

  if (authLoading || loading) {
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
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>💬 Club Inquiry</h2>
                <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>View and manage contact form inquiries</p>
              </div>
              <button
                className="btn-outline"
                onClick={fetchData}
                disabled={loading}
                style={{ padding: '8px 16px' }}
                title="Refresh inquiries"
              >
                🔄 {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>{totalCount}</div>
                <div style={{ color: '#6b7280', marginTop: '0.5rem' }}>Total Inquiries</div>
              </div>
              <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{pendingCount}</div>
                <div style={{ color: '#6b7280', marginTop: '0.5rem' }}>Pending</div>
              </div>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ marginTop: 0, margin: 0 }}>🔍 Filters</h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button
                    className="btn-outline"
                    onClick={() => setFilters({ status: '', search: '' })}
                    style={{ padding: '6px 12px', fontSize: '0.9rem' }}
                  >
                    Clear Filters
                  </button>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                    Showing <strong>{filteredInquiries.length}</strong> of <strong>{inquiries.length}</strong>
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px', minWidth: '150px' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    Search
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search by name, email, or message..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ flex: '1 1 200px', minWidth: '150px' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    Status
                  </label>
                  <select
                    className="form-input"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Inquiries Table */}
            {error && (
              <div className="error" style={{ marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            {filteredInquiries.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                  {inquiries.length === 0 ? 'No inquiries yet.' : 'No inquiries match your filters.'}
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Message</th>
                      <th>Status</th>
                      <th>Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInquiries.map((inquiry) => (
                      <tr key={inquiry.id}>
                        <td style={{ fontWeight: 'bold' }}>{inquiry.name}</td>
                        <td>
                          <a href={`mailto:${inquiry.email}`} style={{ color: '#2563eb' }}>
                            {inquiry.email}
                          </a>
                        </td>
                        <td style={{ maxWidth: '400px' }}>
                          <div style={{ 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            title: inquiry.message
                          }}>
                            {inquiry.message}
                          </div>
                        </td>
                        <td>
                          <select
                            value={inquiry.status}
                            onChange={(e) => handleStatusChange(inquiry.id, e.target.value as Inquiry['status'])}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: '1px solid #d1d5db',
                              fontSize: '0.875rem',
                              backgroundColor: 'white',
                              cursor: 'pointer',
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </td>
                        <td>{new Date(inquiry.created_at).toLocaleString()}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              className="btn-outline"
                              onClick={() => {
                                const fullMessage = `Name: ${inquiry.name}\nEmail: ${inquiry.email}\n\nMessage:\n${inquiry.message}`;
                                navigator.clipboard.writeText(fullMessage);
                                alert('Inquiry details copied to clipboard!');
                              }}
                              style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                              title="Copy inquiry details"
                            >
                              📋 Copy
                            </button>
                            <button
                              className="btn-outline"
                              onClick={() => handleDelete(inquiry.id, inquiry.name)}
                              style={{ padding: '4px 8px', fontSize: '0.85rem', color: '#dc2626', borderColor: '#dc2626' }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

