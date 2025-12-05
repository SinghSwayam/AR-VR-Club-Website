import React from 'react';
import Navbar from '@/components/common/Navbar';
import EventsList from '@/components/home/EventsList';
import ContactForm from '@/components/home/ContactForm';
import Team from '@/components/home/Team';

export default function HomePage() {
  return (
    <>
      <Navbar />
      
      <header className="hero">
        <h1>BUILDING THE METAVERSE</h1>
        <p>
          The AR/VR Club is a dynamic student-led community dedicated to
          exploring the immersive frontiers of Augmented and Virtual Reality.
        </p>
        <div>
          <a href="https://www.linkedin.com/in/ar-vr-club-ghrcem-pune-a4678b287/" className="btn" target="_blank" rel="noopener noreferrer">
            Visit Our LinkedIn
          </a>
        </div>
      </header>

      <section id="about" className="section">
        <h2>About Our Club</h2>
        <div className="grid">
          <div className="card">
            <h3>Hub for Innovation</h3>
            <p>
              We are a student-led community at GHRCEM dedicated to exploring
              and building in the cutting-edge worlds of Augmented and Virtual
              Reality.
            </p>
          </div>
          <div className="card">
            <h3>Hands-on Learning</h3>
            <p>
              We bridge the gap between theory and practice by organizing
              practical workshops, coding jams, and technical seminars on
              spatial computing.
            </p>
          </div>
          <div className="card">
            <h3>Collaborative Development</h3>
            <p>
              The club provides a platform for designers and developers to team
              up, share ideas, and create immersive projects for the Metaverse.
            </p>
          </div>
          <div className="card">
            <h3>Future-Ready Skills</h3>
            <p>
              Our mission is to equip students with the industry-relevant skills
              and tools needed to lead the next generation of digital
              interaction.
            </p>
          </div>
        </div>
      </section>

      <EventsList />

      <Team />

      <section id="contact" className="section">
        <h2>Get in Touch</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
          <div>
            <h3>Let&apos;s Build the Future Together</h3>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>
              Have questions about the club, want to collaborate on a project,
              or just curious about AR/VR? Reach out to us!
            </p>
            <div style={{ marginBottom: '1rem' }}>
              <strong>📍 Location:</strong><br />
              G H Raisoni College of Engineering and Management,<br />
              Wagholi, Pune, Maharashtra.
            </div>
            <div>
              <strong>📧 Email:</strong><br />
              <a href="mailto:arvr_comp@ghrcem.raisoni.net" style={{ color: '#2563eb' }}>
                arvr_comp@ghrcem.raisoni.net
              </a>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <a
                href="https://www.linkedin.com/in/ar-vr-club-ghrcem-pune-a4678b287/"
                className="btn-outline"
                style={{ padding: '5px 10px', fontSize: '0.9rem', marginRight: '10px' }}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                href="https://www.instagram.com/arvr_club_ghrcem/"
                className="btn-outline"
                style={{ padding: '5px 10px', fontSize: '0.9rem' }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer>
        <p><strong>AR/VR Club | Department of Computer Engineering</strong></p>
        <p>G H Raisoni College of Engineering and Management, Pune</p>
        <br />
        <p>&copy; 2025 AR/VR Club GHRCEM. All rights reserved.</p>
      </footer>
    </>
  );
}

