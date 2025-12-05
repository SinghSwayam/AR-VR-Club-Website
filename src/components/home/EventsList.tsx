'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// Event type matching API response format
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

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events');
      const data = await response.json();
      
      if (data.success) {
        // Filter only upcoming/open events
        const now = new Date();
        const upcomingEvents = data.data.filter((event: Event) => {
          const eventDate = new Date(event.StartTime);
          return eventDate >= now && (event.Status === 'Open' || event.Status === 'Full');
        });
        setEvents(upcomingEvents.slice(0, 6)); // Show max 6 events
      } else {
        setError(data.error || 'Failed to load events');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="section">
        <h2>Upcoming Events</h2>
        <div className="loading">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section">
        <h2>Upcoming Events</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="section">
        <h2>Upcoming Events</h2>
        <p style={{ textAlign: 'center', color: '#64748b' }}>No upcoming events at the moment. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="section">
      <h2>Upcoming Events</h2>
      <div className="grid">
        {events.map((event) => (
          <div key={event.ID} className="card">
            {event.ImageURL && (
              <img
                src={event.ImageURL}
                alt={event.Title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                }}
              />
            )}
            <h3>{event.Title}</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>
              {event.Description.length > 100
                ? `${event.Description.substring(0, 100)}...`
                : event.Description}
            </p>
            <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
              <p>
                <strong>Date:</strong> {new Date(event.StartTime).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {new Date(event.StartTime).toLocaleTimeString()} -{' '}
                {new Date(event.EndTime).toLocaleTimeString()}
              </p>
              <p>
                <strong>Capacity:</strong> {event.CurrentCount} / {event.MaxCapacity}
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', gap: '0.5rem' }}>
              <span
                className={`status-badge ${
                  event.Status === 'Open' ? 'status-active' : event.Status === 'Full' ? 'status-warning' : 'status-closed'
                }`}
              >
                {event.Status}
              </span>
              {(event.Status === 'Open' || event.Status === 'Full') && (
                <button
                  className={event.Status === 'Open' ? 'btn' : 'btn-outline'}
                  onClick={() => {
                    if (user) {
                      // User is logged in, redirect to dashboard
                      router.push('/dashboard');
                    } else {
                      // User is not logged in, redirect to login
                      router.push('/login');
                    }
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                  }}
                  disabled={event.Status === 'Full'}
                >
                  Register Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

