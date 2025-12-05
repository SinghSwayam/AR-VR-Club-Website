'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/common/Navbar';
import ChangePasswordModal from '@/components/common/ChangePasswordModal';
// Event and Registration types matching API response format
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

interface Registration {
  RegistrationID: string;
  EventID: string;
  UserID: string;
  UserEmail: string;
  Year?: string;
  Dept?: string;
  RollNo?: string;
  Timestamp: string;
  Status: 'confirmed' | 'cancelled';
  // Event information
  EventTitle?: string;
  EventDescription?: string;
  EventStartTime?: string;
  EventEndTime?: string;
  EventStatus?: string;
}

export default function DashboardPage() {
  const { user, authUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [registrationYear, setRegistrationYear] = useState('');
  const [registrationDept, setRegistrationDept] = useState('');
  const [registrationRollNo, setRegistrationRollNo] = useState('');
  const [registrationMobileNumber, setRegistrationMobileNumber] = useState('');
  const [registering, setRegistering] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch events with cache-busting to ensure fresh data
      const eventsRes = await fetch('/api/events', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const eventsData = await eventsRes.json();
      if (eventsData.success) {
        console.log('Fetched events:', eventsData.data.length);
        setEvents(eventsData.data);
      } else {
        console.error('Failed to fetch events:', eventsData.error);
      }

      // Fetch user registrations
      if (user) {
        const regRes = await fetch(`/api/registrations?userId=${user.uid}`, {
          cache: 'no-store',
        });
        const regData = await regRes.json();
        if (regData.success) {
          setRegistrations(regData.data);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setShowRegistrationModal(true);
    setRegistrationYear('');
    setRegistrationDept('');
    setRegistrationRollNo('');
    setRegistrationMobileNumber('');
  };

  const handleRegister = async () => {
    if (!user || !user.email || !selectedEventId) return;
    
    if (!registrationYear || !registrationDept || !registrationRollNo || !registrationMobileNumber) {
      alert('Please fill in Year, Department, Roll Number, and Mobile Number');
      return;
    }

    setRegistering(true);

    try {
      console.log('Registering for event:', { 
        eventId: selectedEventId, 
        userId: user.uid, 
        userEmail: user.email,
        year: registrationYear,
        dept: registrationDept,
        rollNo: registrationRollNo
      });
      
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEventId,
          userId: user.uid,
          userEmail: user.email,
          year: registrationYear,
          dept: registrationDept,
          rollNo: registrationRollNo,
          mobileNumber: registrationMobileNumber,
        }),
      });

      const data = await response.json();
      console.log('Registration response:', data);
      
      if (data.success) {
        alert('Successfully registered for event!');
        setShowRegistrationModal(false);
        setSelectedEventId(null);
        setRegistrationYear('');
        setRegistrationDept('');
        setRegistrationRollNo('');
        setRegistrationMobileNumber('');
        // Add a small delay to ensure database transaction is committed
        setTimeout(() => {
          fetchData();
        }, 500);
      } else {
        alert(data.error || 'Registration failed');
        console.error('Registration failed:', data);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(`Registration failed: ${error.message || 'Unknown error'}`);
    } finally {
      setRegistering(false);
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

  if (!user) {
    return null;
  }

  const registeredEventIds = registrations.map((r) => r.EventID);
  
  // Calculate events attended (only count registrations for events with status "Completed")
  const eventsAttended = registrations.filter((reg) => reg.EventStatus === 'Completed').length;
  
  // Filter upcoming events: must be in the future and have Open or Full status
  const now = new Date();
  const upcomingEvents = events.filter((e) => {
    if (!e.StartTime) return false;
    const eventDate = new Date(e.StartTime);
    if (isNaN(eventDate.getTime())) {
      console.warn('Invalid event date:', e.StartTime, e);
      return false;
    }
    const isUpcoming = eventDate >= now;
    const isOpenOrFull = e.Status === 'Open' || e.Status === 'Full';
    const shouldShow = isUpcoming && isOpenOrFull;
    if (!shouldShow && isUpcoming) {
      console.log('Event filtered out due to status:', e.Title, e.Status);
    }
    return shouldShow;
  });
  
  console.log('Total events:', events.length, 'Upcoming events:', upcomingEvents.length);

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>🎓 Student Dashboard</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              className="btn-outline"
              onClick={() => setShowPasswordModal(true)}
              style={{ padding: '8px 16px', fontSize: '0.9rem' }}
            >
              🔒 Change Password
            </button>
            <p style={{ color: '#666', margin: 0 }}>Welcome, {authUser?.displayName || authUser?.email}</p>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '2rem', textAlign: 'left', flexDirection: 'row', gap: '20px' }}>
          <img
            src="https://www.w3schools.com/howto/img_avatar2.png"
            alt="Profile"
            style={{ width: '80px', height: '80px', borderRadius: '50%' }}
          />
          <div>
            <h3 style={{ marginTop: 0 }}>Welcome, {authUser?.displayName || user.email}!</h3>
            <p>
              Events Attended: <strong>{eventsAttended}</strong> | Events Registered: <strong>{registrations.length}</strong> | Certificates Earned: <strong>0</strong>
            </p>
          </div>
        </div>

        <h3>Upcoming Events</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Date</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {upcomingEvents.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                  No upcoming events
                </td>
              </tr>
            ) : (
              upcomingEvents.map((event) => {
                const isRegistered = registeredEventIds.includes(event.ID);
                const isFull = event.Status === 'Full' || event.CurrentCount >= event.MaxCapacity;

                return (
                  <tr key={event.ID}>
                    <td>{event.Title}</td>
                    <td>{new Date(event.StartTime).toLocaleDateString()}</td>
                    <td>Workshop</td>
                    <td>
                      <span className={`status-badge ${isFull ? 'status-closed' : 'status-active'}`}>
                        {event.Status}
                      </span>
                    </td>
                    <td>
                      {isRegistered ? (
                        <span className="status-badge status-active">Registered</span>
                      ) : isFull ? (
                        <button className="btn-outline" disabled>
                          Full
                        </button>
                      ) : (
                        <button className="btn" onClick={() => handleRegisterClick(event.ID)} style={{ padding: '4px 10px' }}>
                          Register
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <h3 style={{ marginTop: '3rem', marginBottom: '1rem' }}>Your Registrations</h3>
        {registrations.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#64748b' }}>You haven't registered for any events yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Event Date</th>
                  <th>Year</th>
                  <th>Department</th>
                  <th>Roll No.</th>
                  <th>Registered On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.RegistrationID}>
                    <td style={{ fontWeight: 'bold' }}>
                      {reg.EventTitle || 'Unknown Event'}
                    </td>
                    <td>
                      {reg.EventStartTime 
                        ? new Date(reg.EventStartTime).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td>{reg.Year || 'N/A'}</td>
                    <td>{reg.Dept || 'N/A'}</td>
                    <td>{reg.RollNo || 'N/A'}</td>
                    <td>{new Date(reg.Timestamp).toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${
                        reg.Status === 'confirmed' ? 'status-active' : 'status-closed'
                      }`}>
                        {reg.Status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && (
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
            if (!registering) {
              setShowRegistrationModal(false);
              setSelectedEventId(null);
            }
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '500px',
              width: '90%',
              padding: '2rem',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Register for Event</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Year <span style={{ color: 'red' }}>*</span>
              </label>
              <select
                className="form-input"
                value={registrationYear}
                onChange={(e) => setRegistrationYear(e.target.value)}
                required
                disabled={registering}
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Select Year</option>
                <option value="First Year">First Year</option>
                <option value="Second Year">Second Year</option>
                <option value="Third Year">Third Year</option>
                <option value="Fourth Year">Fourth Year</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Department <span style={{ color: 'red' }}>*</span>
              </label>
              <select
                className="form-input"
                value={registrationDept}
                onChange={(e) => setRegistrationDept(e.target.value)}
                required
                disabled={registering}
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Select Department</option>
                <option value="CSE">Computer Science Engineering (CSE)</option>
                <option value="IT">Information Technology (IT)</option>
                <option value="ECE">Electronics and Communication Engineering (ECE)</option>
                <option value="EE">Electrical Engineering (EE)</option>
                <option value="ME">Mechanical Engineering (ME)</option>
                <option value="CE">Civil Engineering (CE)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Roll Number <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                className="form-input"
                value={registrationRollNo}
                onChange={(e) => setRegistrationRollNo(e.target.value.toUpperCase())}
                placeholder="e.g., TY C-14"
                required
                disabled={registering}
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              />
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                Enter your roll number (e.g., TY C-14, SY A-05)
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Mobile Number <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="tel"
                className="form-input"
                placeholder="e.g., +91 9876543210"
                value={registrationMobileNumber}
                onChange={(e) => setRegistrationMobileNumber(e.target.value)}
                required
                disabled={registering}
                pattern="[+]?[0-9\s-]{10,15}"
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                className="btn-outline"
                onClick={() => {
                  if (!registering) {
                    setShowRegistrationModal(false);
                    setSelectedEventId(null);
                    setRegistrationYear('');
                    setRegistrationDept('');
                    setRegistrationRollNo('');
                    setRegistrationMobileNumber('');
                  }
                }}
                disabled={registering}
              >
                Cancel
              </button>
              <button
                className="btn"
                onClick={handleRegister}
                disabled={registering || !registrationYear || !registrationDept || !registrationRollNo || !registrationMobileNumber}
              >
                {registering ? 'Registering...' : 'Register'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
}

