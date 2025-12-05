'use client';

import React, { useState } from 'react';

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setError(''); // Clear any previous errors
        setSuccess(true);
        e.currentTarget.reset();
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setSuccess(false); // Clear any previous success
        setError(result.error || 'Failed to send message. Please try again.');
      }
    } catch (error: any) {
      console.error('Contact form error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      }}
    >
      {success && !error && (
        <div
          style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: '#d1fae5',
            color: '#065f46',
            borderRadius: '8px',
            border: '1px solid #10b981',
          }}
        >
          ✓ Message sent successfully! We'll get back to you soon.
        </div>
      )}
      {error && !success && (
        <div
          style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: '8px',
            border: '1px solid #ef4444',
          }}
        >
          ✗ {error}
        </div>
      )}
      <input
        type="text"
        name="name"
        className="form-input"
        placeholder="Your Name"
        required
        disabled={submitting}
      />
      <input
        type="email"
        name="email"
        className="form-input"
        placeholder="Your College Email"
        required
        disabled={submitting}
      />
      <textarea
        name="message"
        className="form-input"
        rows={4}
        placeholder="How can we help you?"
        required
        disabled={submitting}
      />
      <button
        type="submit"
        className="btn"
        style={{ width: '100%' }}
        disabled={submitting}
      >
        {submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

