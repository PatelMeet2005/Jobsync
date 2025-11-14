import React from 'react';
import './About.css';

const About = () => {
  const teamMembers = [
    {
      name: 'Manav',
      role: 'UI/UX Developer',
      description: 'Passionate about creating intuitive and beautiful user experiences that make job searching seamless and enjoyable.',
      skills: ['User Research', 'Wireframing', 'Prototyping', 'User Testing', 'Design Systems']
    },
    {
      name: 'Vraj',
      role: 'Frontend Developer',
      description: 'Expert in building responsive and dynamic user interfaces that bring our designs to life with modern web technologies.',
      skills: ['React.js', 'JavaScript', 'HTML/CSS', 'Responsive Design', 'State Management']
    },
    {
      name: 'Meet',
      role: 'Backend Developer',
      description: 'Architecting robust server-side solutions and APIs that power our job platform with reliability and scalability.',
      skills: ['Node.js', 'Express.js', 'Database Design', 'API Development', 'Server Architecture']
    }
  ];

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">About JobSync</h1>
          <p className="hero-subtitle">
            Connecting talented professionals with their dream careers through innovative technology
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>
              At JobSync, we believe that finding the right job should be effortless and rewarding. 
              Our platform bridges the gap between talented professionals and forward-thinking companies, 
              creating meaningful connections that drive success for both parties.
            </p>
            <div className="mission-stats">
              <div className="stat-item">
                <h3>100+</h3>
                <p>Jobs Posted</p>
              </div>
              <div className="stat-item">
                <h3>50+</h3>
                <p>Companies</p>
              </div>
              <div className="stat-item">
                <h3>10,00+</h3>
                <p>Happy Users</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Meet Our Team</h2>
          <p className="team-intro">
            We're a passionate team of developers and designers dedicated to revolutionizing the job search experience.
          </p>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="member-avatar">
                  <span className="avatar-text">{member.name.charAt(0)}</span>
                </div>
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-description">{member.description}</p>
                <div className="member-skills">
                  {member.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🎯</div>
              <h3>Innovation</h3>
              <p>Continuously pushing boundaries to create cutting-edge solutions for modern job seekers.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Collaboration</h3>
              <p>Working together as a team to deliver exceptional results and exceed expectations.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>Excellence</h3>
              <p>Committed to delivering the highest quality user experience and technical solutions.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🚀</div>
              <h3>Growth</h3>
              <p>Fostering continuous learning and development for our team and our users.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <h2>Get In Touch</h2>
          <p>Have questions or want to learn more about JobSync? We'd love to hear from you!</p>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <p>Meet@jobsync.com</p>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📱</span>
              <p>+91 7862056323</p>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <p>123 Charotar city, Tech City, 12345</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
