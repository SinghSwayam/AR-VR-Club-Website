'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/common/Navbar';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface Event {
  ID: string;
  Title: string;
  Description: string;
  StartTime: string;
  EndTime: string;
  MaxCapacity: number;
  CurrentCount: number;
  Status: 'Open' | 'Full' | 'Closed' | 'Completed';
  ImageURL?: string;
  CreatedAt: string;
}

export default function EventManagementPage() {
  const { authUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    Title: '',
    Description: '',
    StartTime: '',
    EndTime: '',
    MaxCapacity: '',
    ImageURL: '',
    Status: 'Open' as 'Open' | 'Full' | 'Closed' | 'Completed',
  });
  const [submitting, setSubmitting] = useState(false);

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
      fetchEvents();
    }
  }, [authUser]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events');
      const data = await response.json();
      if (data.success) {
        setEvents(data.data);
      } else {
        setError(data.error || 'Failed to load events');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingEvent(null);
    setFormData({
      Title: '',
      Description: '',
      StartTime: '',
      EndTime: '',
      MaxCapacity: '',
      ImageURL: '',
      Status: 'Open',
    });
    setShowModal(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      Title: event.Title,
      Description: event.Description,
      StartTime: new Date(event.StartTime).toISOString().slice(0, 16),
      EndTime: new Date(event.EndTime).toISOString().slice(0, 16),
      MaxCapacity: event.MaxCapacity.toString(),
      ImageURL: event.ImageURL || '',
      Status: event.Status,
    });
    setShowModal(true);
  };

  const handleDelete = async (eventId: string) => {
    const event = events.find(e => e.ID === eventId);
    const eventName = event?.Title || 'this event';
    
    if (!confirm(`Are you sure you want to delete "${eventName}"?\n\nThis will also delete all registrations for this event.\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        alert('Event and all its registrations deleted successfully');
        fetchEvents();
      } else {
        // Check if it's a foreign key error
        if (data.error?.includes('foreign key constraint') || data.error?.includes('CASCADE')) {
          alert(
            `Cannot delete event: ${data.error}\n\n` +
            `Please run the SQL script in supabase/fix-foreign-key-cascade.sql ` +
            `in your Supabase SQL Editor to enable CASCADE delete.`
          );
        } else {
          alert(data.error || 'Failed to delete event');
        }
      }
    } catch (err: any) {
      alert(`Failed to delete event: ${err.message || 'Unknown error'}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Convert datetime-local to ISO string (handles timezone correctly)
      const startDate = new Date(formData.StartTime);
      const endDate = new Date(formData.EndTime);
      
      // Validate dates
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        setError('Invalid date format. Please check your date and time inputs.');
        setSubmitting(false);
        return;
      }
      
      if (endDate <= startDate) {
        setError('End time must be after start time.');
        setSubmitting(false);
        return;
      }
      
      const payload = {
        Title: formData.Title,
        Description: formData.Description,
        StartTime: startDate.toISOString(),
        EndTime: endDate.toISOString(),
        MaxCapacity: parseInt(formData.MaxCapacity, 10),
        ImageURL: formData.ImageURL,
        Status: formData.Status,
      };

      let response;
      if (editingEvent) {
        // Update existing event
        response = await fetch(`/api/events/${editingEvent.ID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new event
        response = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();
      if (data.success) {
        alert(editingEvent ? 'Event updated successfully' : 'Event created successfully');
        setShowModal(false);
        fetchEvents();
      } else {
        setError(data.error || 'Failed to save event');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

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
                <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>📅 Event Management</h2>
                <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>Create, edit, and manage club events</p>
              </div>
          <button className="btn" onClick={handleCreate}>
            + Create New Event
          </button>
        </div>

        {error && (
          <div className="error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {events.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No events found. Create your first event!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.ID}>
                    <td style={{ fontWeight: 'bold' }}>{event.Title}</td>
                    <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {event.Description}
                    </td>
                    <td>{new Date(event.StartTime).toLocaleString()}</td>
                    <td>{new Date(event.EndTime).toLocaleString()}</td>
                    <td>{event.CurrentCount} / {event.MaxCapacity}</td>
                    <td>
                      <span className={`status-badge ${
                        event.Status === 'Open' ? 'status-active' :
                        event.Status === 'Full' ? 'status-warning' :
                        'status-closed'
                      }`}>
                        {event.Status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn-outline"
                          onClick={() => handleEdit(event)}
                          style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-outline"
                          onClick={() => handleDelete(event.ID)}
                          style={{ padding: '4px 8px', fontSize: '0.85rem', color: '#dc2626', borderColor: '#dc2626' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={() => {
              if (!submitting) {
                setShowModal(false);
              }
            }}
          >
            <div
              className="card"
              style={{
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2rem',
                position: 'relative',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h3>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Title <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.Title}
                    onChange={(e) => setFormData({ ...formData, Title: e.target.value })}
                    required
                    disabled={submitting}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Description <span style={{ color: 'red' }}>*</span>
                  </label>
                  <textarea
                    className="form-input"
                    value={formData.Description}
                    onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                    required
                    rows={4}
                    disabled={submitting}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Start Time <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="datetime-local"
                      className="form-input"
                      value={formData.StartTime}
                      onChange={(e) => setFormData({ ...formData, StartTime: e.target.value })}
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      End Time <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="datetime-local"
                      className="form-input"
                      value={formData.EndTime}
                      onChange={(e) => setFormData({ ...formData, EndTime: e.target.value })}
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Max Capacity <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.MaxCapacity}
                      onChange={(e) => setFormData({ ...formData, MaxCapacity: e.target.value })}
                      required
                      min="1"
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Status <span style={{ color: 'red' }}>*</span>
                    </label>
                    <select
                      className="form-input"
                      value={formData.Status}
                      onChange={(e) => setFormData({ ...formData, Status: e.target.value as any })}
                      required
                      disabled={submitting}
                    >
                      <option value="Open">Open</option>
                      <option value="Full">Full</option>
                      <option value="Closed">Closed</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Image URL (optional)
                  </label>
                  <input
                    type="url"
                    className="form-input"
                    value={formData.ImageURL}
                    onChange={(e) => setFormData({ ...formData, ImageURL: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    disabled={submitting}
                  />
                </div>

                {error && (
                  <div className="error" style={{ marginBottom: '1rem' }}>
                    {error}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => {
                      if (!submitting) {
                        setShowModal(false);
                      }
                    }}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn"
                    disabled={submitting}
                  >
                    {submitting ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
          </div>
        </div>
      </div>
    </>
  );
}

