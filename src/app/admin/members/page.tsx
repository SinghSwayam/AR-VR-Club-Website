'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/common/Navbar';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface Member {
  UserID: string;
  Name: string;
  Email: string;
  Role: 'student' | 'admin';
  Year?: string;
  Dept?: string;
  Designation?: string;
  MobileNumber?: string;
  CreatedAt: string;
}

export default function MemberManagementPage() {
  const { authUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Role: 'student' as 'student' | 'admin',
    Year: '',
    Dept: '',
    Designation: '',
    MobileNumber: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    role: '',
    year: '',
    dept: '',
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
      fetchMembers();
    }
  }, [authUser]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      if (data.success) {
        setMembers(data.data);
      } else {
        setError(data.error || 'Failed to load members');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingMember(null);
    setFormData({
      Name: '',
      Email: '',
      Role: 'student',
      Year: '',
      Dept: '',
      Designation: '',
      MobileNumber: '',
    });
    setError('');
    setShowModal(true);
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setFormData({
      Name: member.Name,
      Email: member.Email,
      Role: member.Role,
      Year: member.Year || '',
      Dept: member.Dept || '',
      Designation: member.Designation || '',
      MobileNumber: member.MobileNumber || '',
    });
    setError('');
    setShowModal(true);
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete "${userName}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        alert('Member deleted successfully');
        fetchMembers();
      } else {
        alert(data.error || 'Failed to delete member');
      }
    } catch (err: any) {
      alert(`Failed to delete member: ${err.message || 'Unknown error'}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingMember) {
        // Update existing member
        const response = await fetch(`/api/users/${editingMember.UserID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (data.success) {
          alert('Member updated successfully');
          setShowModal(false);
          fetchMembers();
        } else {
          setError(data.error || 'Failed to update member');
        }
      } else {
        // Create new member
        const response = await fetch('/api/admin/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (data.success) {
          alert(data.message || 'Member added successfully');
          setShowModal(false);
          fetchMembers();
        } else {
          setError(data.error || 'Failed to add member');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save member');
    } finally {
      setSubmitting(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      role: '',
      year: '',
      dept: '',
      search: '',
    });
  };

  // Apply filters
  const filteredMembers = members.filter((member) => {
    if (filters.role && member.Role !== filters.role) return false;
    if (filters.year && member.Year !== filters.year) return false;
    if (filters.dept && member.Dept !== filters.dept) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        member.Name?.toLowerCase().includes(searchLower) ||
        member.Email?.toLowerCase().includes(searchLower) ||
        member.MobileNumber?.toLowerCase().includes(searchLower) ||
        member.Year?.toLowerCase().includes(searchLower) ||
        member.Dept?.toLowerCase().includes(searchLower) ||
        member.Designation?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // Get unique values for filter dropdowns
  const uniqueYears = Array.from(new Set(members.map(m => m.Year).filter(Boolean))).sort();
  const uniqueDepts = Array.from(new Set(members.map(m => m.Dept).filter(Boolean))).sort();

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
                <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>👥 Member Management</h2>
                <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>View and manage club members</p>
              </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              className="btn"
              onClick={handleCreate}
              style={{ padding: '8px 16px' }}
            >
              ➕ Add Member
            </button>
            <button
              className="btn-outline"
              onClick={() => {
                const params = new URLSearchParams({ type: 'users', format: 'excel' });
                if (filters.role) params.append('role', filters.role);
                if (filters.year) params.append('year', filters.year);
                if (filters.dept) params.append('dept', filters.dept);
                if (filters.search) params.append('search', filters.search);
                window.open(`/api/export?${params.toString()}`, '_blank');
              }}
              style={{ padding: '8px 16px' }}
            >
              📊 Export Excel
            </button>
            <button
              className="btn-outline"
              onClick={() => {
                const params = new URLSearchParams({ type: 'users', format: 'pdf' });
                if (filters.role) params.append('role', filters.role);
                if (filters.year) params.append('year', filters.year);
                if (filters.dept) params.append('dept', filters.dept);
                if (filters.search) params.append('search', filters.search);
                window.open(`/api/export?${params.toString()}`, '_blank');
              }}
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
                Showing <strong>{filteredMembers.length}</strong> of <strong>{members.length}</strong>
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
                placeholder="Search by name, email, designation..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ flex: '0 1 120px', minWidth: '100px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                Role
              </label>
              <select
                className="form-input"
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="">All Roles</option>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
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
          </div>
        </div>

        {error && !showModal && (
          <div className="error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {/* Members Table */}
        {filteredMembers.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
              {members.length === 0 
                ? 'No members found. Click "Add Member" to get started.' 
                : 'No members match the current filters.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile Number</th>
                  <th>Designation</th>
                  <th>Role</th>
                  <th>Year</th>
                  <th>Department</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.UserID}>
                    <td style={{ fontWeight: 'bold' }}>{member.Name}</td>
                    <td>{member.Email}</td>
                    <td>{member.MobileNumber || 'N/A'}</td>
                    <td>{member.Designation || 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${
                        member.Role === 'admin' ? 'status-warning' : 'status-active'
                      }`}>
                        {member.Role}
                      </span>
                    </td>
                    <td>{member.Year || 'N/A'}</td>
                    <td>{member.Dept || 'N/A'}</td>
                    <td>{new Date(member.CreatedAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn-outline"
                          onClick={() => handleEdit(member)}
                          style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-outline"
                          onClick={() => handleDelete(member.UserID, member.Name)}
                          style={{ padding: '4px 8px', fontSize: '0.85rem', color: '#dc2626', borderColor: '#dc2626' }}
                          disabled={member.UserID === authUser?.uid}
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

        {/* Add/Edit Modal */}
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
                {editingMember ? 'Edit Member' : 'Add New Member'}
              </h3>

              {!editingMember && (
                <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#dbeafe', borderRadius: '8px', fontSize: '0.9rem' }}>
                  <strong>Note:</strong> The member will be added to the database. They can sign up later using this email, and their account will be automatically linked.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Name <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.Name}
                    onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                    required
                    disabled={submitting}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Email <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.Email}
                    onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                    required
                    disabled={submitting || !!editingMember}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Designation
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., President, Secretary, Treasurer, Member"
                    value={formData.Designation}
                    onChange={(e) => setFormData({ ...formData, Designation: e.target.value })}
                    disabled={submitting}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="e.g., +91 9876543210"
                    value={formData.MobileNumber}
                    onChange={(e) => setFormData({ ...formData, MobileNumber: e.target.value })}
                    pattern="[+]?[0-9\s-]{10,15}"
                    disabled={submitting}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Role <span style={{ color: 'red' }}>*</span>
                    </label>
                    <select
                      className="form-input"
                      value={formData.Role}
                      onChange={(e) => setFormData({ ...formData, Role: e.target.value as 'student' | 'admin' })}
                      required
                      disabled={submitting}
                    >
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Year
                    </label>
                    <select
                      className="form-input"
                      value={formData.Year}
                      onChange={(e) => setFormData({ ...formData, Year: e.target.value })}
                      disabled={submitting}
                    >
                      <option value="">Select Year</option>
                      <option value="First Year">First Year</option>
                      <option value="Second Year">Second Year</option>
                      <option value="Third Year">Third Year</option>
                      <option value="Fourth Year">Fourth Year</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Department
                  </label>
                  <select
                    className="form-input"
                    value={formData.Dept}
                    onChange={(e) => setFormData({ ...formData, Dept: e.target.value })}
                    disabled={submitting}
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
                    {submitting ? 'Saving...' : editingMember ? 'Update Member' : 'Add Member'}
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
