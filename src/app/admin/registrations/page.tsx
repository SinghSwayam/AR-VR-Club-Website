'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/common/Navbar';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface Registration {
  registration_id: string;
  event_id: string;
  user_id: string;
  user_email: string;
  year?: string;
  dept?: string;
  roll_no?: string;
  timestamp: string;
  status: 'confirmed' | 'cancelled';
  // Event information
  event_title?: string;
  event_start_time?: string;
}

interface Event {
  id: string;
  title: string;
}

export default function RegistrationsManagementPage() {
  const { authUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [filters, setFilters] = useState({
    year: '',
    dept: '',
    eventId: '',
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
      
      // Auto-refresh every 30 seconds to catch new registrations
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
      
      // Fetch all registrations with event info (with cache-busting)
      const regRes = await fetch('/api/admin/registrations', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const regData = await regRes.json();
      if (regData.success) {
        setRegistrations(regData.data);
      } else {
        setError(regData.error || 'Failed to load registrations');
      }

      // Fetch events for filter dropdown
      const eventsRes = await fetch('/api/events', {
        cache: 'no-store',
      });
      const eventsData = await eventsRes.json();
      if (eventsData.success) {
        setEvents(eventsData.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const filteredRegistrations = registrations.filter((reg) => {
    if (filters.year && reg.year !== filters.year) return false;
    if (filters.dept && reg.dept !== filters.dept) return false;
    if (filters.eventId && reg.event_id !== filters.eventId) return false;
    if (filters.status && reg.status !== filters.status) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        reg.user_email?.toLowerCase().includes(searchLower) ||
        reg.roll_no?.toLowerCase().includes(searchLower) ||
        reg.event_title?.toLowerCase().includes(searchLower) ||
        reg.year?.toLowerCase().includes(searchLower) ||
        reg.dept?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const handleExport = async (format: 'excel' | 'pdf') => {
    try {
      // Build query string with filters
      const params = new URLSearchParams({
        type: 'registrations',
        format: format,
      });

      if (filters.year) params.append('year', filters.year);
      if (filters.dept) params.append('dept', filters.dept);
      if (filters.eventId) params.append('eventId', filters.eventId);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/export?${params.toString()}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const dateStr = new Date().toISOString().split('T')[0];
        a.download = `registrations_${dateStr}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        alert(`Successfully exported ${filteredRegistrations.length} registration(s) to ${format.toUpperCase()}!`);
      } else {
        const errorData = await response.json();
        alert(`Export failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      alert(`Export failed: ${error.message || 'Network error'}`);
      console.error('Export error:', error);
    }
  };

  const clearFilters = () => {
    setFilters({
      year: '',
      dept: '',
      eventId: '',
      status: '',
      search: '',
    });
  };

  // Get unique values for filter dropdowns
  const uniqueYears = Array.from(new Set(registrations.map(r => r.year).filter(Boolean))).sort();
  const uniqueDepts = Array.from(new Set(registrations.map(r => r.dept).filter(Boolean))).sort();

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
                <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>📝 Registration Management</h2>
                <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>View, filter, and export event registrations</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn-outline"
              onClick={fetchData}
              disabled={loading}
              style={{ padding: '8px 16px' }}
              title="Refresh registrations"
            >
              🔄 {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              className="btn"
              onClick={() => handleExport('excel')}
              style={{ padding: '8px 16px' }}
            >
              📊 Export Excel
            </button>
            <button
              className="btn-outline"
              onClick={() => handleExport('pdf')}
              style={{ padding: '8px 16px' }}
            >
              📄 Export PDF
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ marginTop: 0, margin: 0 }}>🔍 Filters</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button
                className="btn-outline"
                onClick={clearFilters}
                style={{ padding: '6px 12px', fontSize: '0.9rem' }}
              >
                Clear Filters
              </button>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                Showing <strong>{filteredRegistrations.length}</strong> of <strong>{registrations.length}</strong>
              </p>
            </div>
          </div>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'flex-end'
          }}>
            <div style={{ flex: '1 1 200px', minWidth: '150px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                Search
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Search by email, roll no, event..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ flex: '0 1 150px', minWidth: '120px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                Year
              </label>
              <select
                className="form-input"
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="">All Years</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: '0 1 150px', minWidth: '120px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                Department
              </label>
              <select
                className="form-input"
                value={filters.dept}
                onChange={(e) => setFilters({ ...filters, dept: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="">All Departments</option>
                {uniqueDepts.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: '1 1 200px', minWidth: '150px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                Event
              </label>
              <select
                className="form-input"
                value={filters.eventId}
                onChange={(e) => setFilters({ ...filters, eventId: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="">All Events</option>
                {events.map(event => (
                  <option key={event.ID} value={event.ID}>{event.Title}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: '0 1 120px', minWidth: '100px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                Status
              </label>
              <select
                className="form-input"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {/* Registrations Table */}
        {filteredRegistrations.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
              {registrations.length === 0 
                ? 'No registrations found.' 
                : 'No registrations match the current filters.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>User Email</th>
                  <th>Year</th>
                  <th>Department</th>
                  <th>Roll No.</th>
                  <th>Registered On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.registration_id}>
                    <td style={{ fontWeight: 'bold' }}>
                      {reg.event_title || 'Unknown Event'}
                    </td>
                    <td>{reg.user_email}</td>
                    <td>{reg.year || 'N/A'}</td>
                    <td>{reg.dept || 'N/A'}</td>
                    <td>{reg.roll_no || 'N/A'}</td>
                    <td>{new Date(reg.timestamp).toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${
                        reg.status === 'confirmed' ? 'status-active' : 'status-closed'
                      }`}>
                        {reg.status}
                      </span>
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

