'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp, signInWithGoogle, signOutUser, resetPassword } from '@/lib/firebase/auth';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/common/Navbar';

export default function LoginPage() {
  const router = useRouter();
  const { authUser, loading: authLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loginRole, setLoginRole] = useState<'student' | 'admin'>('student'); // Role selector for login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [dept, setDept] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVerifyingRole, setIsVerifyingRole] = useState(false); // Track if we're verifying role
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  // Redirect if already logged in (but not during role verification)
  useEffect(() => {
    if (!authLoading && authUser && !isVerifyingRole && !loading) {
      if (authUser.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [authUser, authLoading, router, isVerifyingRole, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let userId: string;
      if (isLogin) {
        setIsVerifyingRole(true);
        const user = await signIn(email, password);
        userId = user.uid;
        
        // Wait a moment for database sync, then verify role
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if user's role matches the selected login role
        try {
          const response = await fetch(`/api/users?userId=${userId}`);
          const data = await response.json();
          
          if (!data.success || !data.data) {
            // Sign out the user since role verification failed
            await signOutUser();
            setError('User not found in database. Please contact support.');
            setLoading(false);
            setIsVerifyingRole(false);
            return;
          }
          
          const userRole = data.data.Role?.toLowerCase(); // Normalize to lowercase
          const selectedRole = loginRole.toLowerCase();
          
          // Verify the selected role matches the user's actual role
          if (userRole !== selectedRole) {
            // Sign out the user since role verification failed
            await signOutUser();
            setError(`You are trying to sign in as ${loginRole}, but your account is registered as ${userRole}. Please select the correct role and try again.`);
            setLoading(false);
            setIsVerifyingRole(false);
            return;
          }
          
          // Role matches, allow AuthContext to handle redirect
          setIsVerifyingRole(false);
          // Small delay to let AuthContext update
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Redirect accordingly
          if (userRole === 'admin') {
            router.push('/admin');
          } else {
            router.push('/dashboard');
          }
        } catch (err) {
          // Sign out the user since role verification failed
          await signOutUser();
          setError('Failed to verify user role. Please try again.');
          setLoading(false);
          setIsVerifyingRole(false);
        }
      } else {
        // Sign up - always creates as student
        if (!name) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        if (!year) {
          setError('Year is required');
          setLoading(false);
          return;
        }
        if (!dept) {
          setError('Department is required');
          setLoading(false);
          return;
        }
        const user = await signUp(email, password, name, year, dept, mobileNumber);
        userId = user.uid;
        
        // Wait for database sync, then redirect to dashboard (sign-ups are always students)
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push('/dashboard');
      }
    } catch (err: any) {
      // Handle Firebase "email already in use" error specially
      if (err.message?.includes('email-already-in-use')) {
        setError('This email is already registered. Please sign in instead, or if you just signed up, try signing in now.');
      } else {
        setError(err.message || 'Authentication failed');
      }
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setError('');

    if (!forgotPasswordEmail) {
      setError('Please enter your email address');
      setForgotPasswordLoading(false);
      return;
    }

    try {
      await resetPassword(forgotPasswordEmail);
      setForgotPasswordSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    setIsVerifyingRole(true);

    try {
      const user = await signInWithGoogle();
      
      // Wait for database sync, then verify role
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if user's role matches the selected login role
      try {
        const response = await fetch(`/api/users?userId=${user.uid}`);
        const data = await response.json();
        
        if (!data.success || !data.data) {
          // Sign out the user since role verification failed
          await signOutUser();
          setError('User not found in database. Please contact support.');
          setLoading(false);
          setIsVerifyingRole(false);
          return;
        }
        
        const userRole = data.data.Role?.toLowerCase(); // Normalize to lowercase
        const selectedRole = loginRole.toLowerCase();
        
        // Verify the selected role matches the user's actual role
        if (userRole !== selectedRole) {
          // Sign out the user since role verification failed
          await signOutUser();
          setError(`You are trying to sign in as ${loginRole}, but your account is registered as ${userRole}. Please select the correct role and try again.`);
          setLoading(false);
          setIsVerifyingRole(false);
          return;
        }
        
        // Role matches, allow AuthContext to handle redirect
        setIsVerifyingRole(false);
        // Small delay to let AuthContext update
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Redirect accordingly
        if (userRole === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } catch (err) {
        // Sign out the user since role verification failed
        await signOutUser();
        setError('Failed to verify user role. Please try again.');
        setLoading(false);
        setIsVerifyingRole(false);
      }
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError(err.message || 'Google sign-in failed');
      setLoading(false);
      setIsVerifyingRole(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {isLogin ? 'Sign In' : 'Sign Up'}
        </h2>

        {error && (
          <div className="error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
          {isLogin && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                I am signing in as:
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setLoginRole('student')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: `2px solid ${loginRole === 'student' ? '#2563eb' : '#d1d5db'}`,
                    borderRadius: '8px',
                    backgroundColor: loginRole === 'student' ? '#eff6ff' : 'white',
                    color: loginRole === 'student' ? '#2563eb' : '#6b7280',
                    fontWeight: loginRole === 'student' ? 'bold' : 'normal',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s',
                  }}
                >
                  🎓 Student
                </button>
                <button
                  type="button"
                  onClick={() => setLoginRole('admin')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: `2px solid ${loginRole === 'admin' ? '#2563eb' : '#d1d5db'}`,
                    borderRadius: '8px',
                    backgroundColor: loginRole === 'admin' ? '#eff6ff' : 'white',
                    color: loginRole === 'admin' ? '#2563eb' : '#6b7280',
                    fontWeight: loginRole === 'admin' ? 'bold' : 'normal',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s',
                  }}
                >
                  🔧 Admin
                </button>
              </div>
            </div>
          )}
          {!isLogin && (
            <>
              <input
                type="text"
                className="form-input"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
              <select
                className="form-input"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required={!isLogin}
                style={{ 
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
              <select
                className="form-input"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                required={!isLogin}
                style={{ 
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
            </>
          )}
          <input
            type="email"
            className="form-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          {isLogin && (
            <div style={{ textAlign: 'right', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(true);
                  setForgotPasswordEmail(email); // Pre-fill with current email if available
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '0.9rem',
                }}
              >
                Forgot Password?
              </button>
            </div>
          )}
          <button
            type="submit"
            className="btn"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginBottom: '1rem' }}>
          {isLogin && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f3f4f6', borderRadius: '8px', fontSize: '0.85rem', color: '#6b7280' }}>
              <strong>Note:</strong> Make sure to select the correct role (Student/Admin) before signing in with Google.
            </div>
          )}
          <button
            onClick={handleGoogleSignIn}
            className="btn-outline"
            style={{ width: '100%' }}
            disabled={loading}
          >
            Sign in with Google
          </button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setLoginRole('student'); // Reset to student when switching
              setYear('');
              setDept('');
              setMobileNumber('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#2563eb',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
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
              if (!forgotPasswordLoading) {
                setShowForgotPassword(false);
                setForgotPasswordEmail('');
                setForgotPasswordSuccess(false);
                setError('');
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
              {forgotPasswordSuccess ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                  <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Check Your Email</h3>
                  <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                    We've sent a password reset link to <strong>{forgotPasswordEmail}</strong>
                  </p>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Please check your inbox and click the link to reset your password. The link will expire in 1 hour.
                  </p>
                  <button
                    className="btn"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotPasswordEmail('');
                      setForgotPasswordSuccess(false);
                    }}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Reset Password</h3>
                  <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                  <form onSubmit={handleForgotPassword}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Email Address <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="Enter your email"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        required
                        disabled={forgotPasswordLoading}
                        style={{ width: '100%' }}
                        autoFocus
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
                          if (!forgotPasswordLoading) {
                            setShowForgotPassword(false);
                            setForgotPasswordEmail('');
                            setError('');
                          }
                        }}
                        disabled={forgotPasswordLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn"
                        disabled={forgotPasswordLoading || !forgotPasswordEmail}
                      >
                        {forgotPasswordLoading ? 'Sending...' : 'Send Reset Link'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

