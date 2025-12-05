'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface SidebarItem {
  label: string;
  path: string;
  icon: string;
}

const sidebarItems: SidebarItem[] = [
  { label: 'Profile', path: '/admin', icon: '👤' },
  { label: 'Event Management', path: '/admin/events', icon: '📅' },
  { label: 'Member Management', path: '/admin/members', icon: '👥' },
  { label: 'Registration Management', path: '/admin/registrations', icon: '📝' },
  { label: 'Club Inquiry', path: '/admin/inquiries', icon: '💬' },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { authUser } = useAuth();

  return (
    <div
      style={{
        width: '280px',
        minHeight: 'calc(100vh - 60px)',
        background: '#ffffff',
        color: '#000000',
        padding: '0',
        position: 'fixed',
        top: '60px',
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
        borderRight: '1px solid #e5e7eb',
        zIndex: 100,
      }}
    >
      {/* Logo/Header */}
      <div style={{ 
        padding: '2rem 1.5rem', 
        borderBottom: '1px solid #e5e7eb',
        background: '#f9fafb',
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
          }}>
            🔧
          </div>
          <div>
            <h2 style={{ 
              margin: 0, 
              fontSize: '1.25rem', 
              fontWeight: '800',
              letterSpacing: '-0.5px',
              color: '#000000',
            }}>
              Admin Panel
            </h2>
          </div>
        </div>
        {authUser && (
          <div style={{ 
            padding: '0.75rem',
            borderRadius: '8px',
            background: '#f3f4f6',
            border: '1px solid #e5e7eb',
          }}>
            <p style={{ 
              margin: 0, 
              fontSize: '0.75rem', 
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: '600',
              marginBottom: '0.25rem',
            }}>
              Logged in as
            </p>
            <p style={{ 
              margin: 0, 
              fontSize: '0.875rem', 
              color: '#000000',
              fontWeight: '600',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {authUser.displayName || authUser.email}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        padding: '0.5rem 0.75rem',
        gap: '0.125rem',
      }}>
        {sidebarItems.map((item) => {
          const isActive = pathname === item.path || 
            (item.path !== '/admin' && pathname?.startsWith(item.path));
          
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              style={{
                width: '100%',
                padding: '0.625rem 1rem',
                backgroundColor: isActive 
                  ? '#eff6ff' 
                  : 'transparent',
                color: isActive ? '#1e40af' : '#000000',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '0.9375rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                transition: 'all 0.2s ease',
                borderRadius: '10px',
                borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                position: 'relative',
                fontWeight: isActive ? '700' : '600',
                boxShadow: isActive 
                  ? '0 2px 8px rgba(59, 130, 246, 0.2)' 
                  : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.color = '#000000';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#000000';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              <span style={{ 
                fontSize: '1.125rem', 
                minWidth: '24px', 
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: isActive ? 'none' : 'opacity(0.8)',
              }}>
                {item.icon}
              </span>
              <span style={{ 
                flex: 1,
                letterSpacing: '0.2px',
              }}>
                {item.label}
              </span>
              {isActive && (
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6',
                  boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)',
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ 
        padding: '1.5rem',
        borderTop: '1px solid #e5e7eb',
        background: '#f9fafb',
      }}>
        <div style={{
          padding: '0.75rem',
          borderRadius: '8px',
          background: '#f3f4f6',
          textAlign: 'center',
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: '0.8125rem', 
            color: '#000000',
            fontWeight: '700',
            letterSpacing: '0.5px',
          }}>
            AR/VR Club
          </p>
          <p style={{ 
            margin: '0.25rem 0 0 0', 
            fontSize: '0.75rem', 
            color: '#374151',
            fontWeight: '600',
          }}>
            GHRCEM
          </p>
        </div>
      </div>
    </div>
  );
}

