'use client';

import React, { useState } from 'react';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin?: string;
  github?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Anshul Zilpe',
    role: 'President',
    image: '/Assets/Pfp/Anshul_pfp.jpg',
    linkedin: 'https://www.linkedin.com/in/anshul-zilpe-245b87332/',
    github: 'https://github.com/aNsHuL5217',
  },
  {
    name: 'Snehal Jadhav',
    role: 'Vice President',
    image: 'https://www.w3schools.com/w3images/avatar6.png',
    linkedin: 'https://www.linkedin.com/in/snehal-jadhav-0ab64a321/',
    github: 'https://github.com/snehaljadhav7317',
  },
  {
    name: 'Uday Salathia',
    role: 'Technical Lead',
    image: 'https://www.w3schools.com/w3images/avatar5.png',
    linkedin: 'https://www.linkedin.com/in/uday-salathia-6b13a11b5/',
    github: 'https://github.com/uday-1602',
  },
];

const additionalMembers: TeamMember[] = [
  {
    name: 'Vidhi Gupta',
    role: 'Management Head',
    image: 'https://www.w3schools.com/w3images/avatar2.png',
    linkedin: 'https://www.linkedin.com/in/vidhi-gupta-7b16b0263/',
  },
  {
    name: 'Sanjana Rajput',
    role: 'Project Manager',
    image: 'https://www.w3schools.com/w3images/avatar3.png',
  },
  {
    name: 'Meet Khandelwal',
    role: 'Research Officer',
    image: 'https://www.w3schools.com/w3images/avatar4.png',
  },
  {
    name: 'Swayam Omprakash Singh',
    role: 'Unity Developer Lead',
    image: 'https://www.w3schools.com/howto/img_avatar.png',
    linkedin: 'https://www.linkedin.com/in/singhswayam/',
    github: 'https://github.com/SinghSwayam',
  },
  {
    name: 'Soham Mandrekar',
    role: 'Public Relations Head',
    image: 'https://www.w3schools.com/w3images/avatar2.png',
    linkedin: 'https://www.linkedin.com/in/soham-mandrekar-a3b516296/',
  },
  {
    name: 'Harshil Kolhe',
    role: 'Training Co-ordinator',
    image: 'https://www.w3schools.com/w3images/avatar5.png',
  },
  {
    name: 'Kundan Deshmukh',
    role: 'Supportive Services Lead',
    image: 'https://www.w3schools.com/w3images/avatar5.png',
  },
];

export default function Team() {
  const [showAll, setShowAll] = useState(false);

  const displayMembers = showAll ? [...teamMembers, ...additionalMembers] : teamMembers;

  return (
    <section id="team" className="section" style={{ backgroundColor: '#fff' }}>
        <h2>Our Team</h2>
        
        {/* Faculty Coordinator */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
          <div
            className="card"
            style={{ width: '100%', maxWidth: '320px', borderTop: '4px solid #2563eb' }}
          >
            <img
              src="https://www.w3schools.com/howto/img_avatar.png"
              alt="Faculty"
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '0.5rem',
                border: '3px solid #e2e8f0',
              }}
            />
            <h3>Prof. Shubhangi Ingale</h3>
            <p><strong>Faculty Coordinator</strong></p>
            <p style={{ fontSize: '0.85rem', marginTop: '5px' }}>
              Guiding the club&apos;s academic vision.
            </p>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid">
          {displayMembers.map((member, index) => (
            <div key={index} className="sideways-card">
              <img src={member.image} alt={member.name} />
              <div className="initial-role">{member.role}</div>
              <div className="sideways-info">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
                <div className="sideways-socials">
                  {member.linkedin ? (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-linkedin"></i>
                    </a>
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '1rem', cursor: 'default' }}>
                      <i className="fab fa-linkedin"></i>
                    </span>
                  )}
                  {member.github ? (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-github"></i>
                    </a>
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '1rem', cursor: 'default' }}>
                      <i className="fab fa-github"></i>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button
            onClick={() => setShowAll(!showAll)}
            className="btn"
          >
            {showAll ? 'Show Less' : 'View All Leads'}
          </button>
        </div>
      </section>
  );
}
