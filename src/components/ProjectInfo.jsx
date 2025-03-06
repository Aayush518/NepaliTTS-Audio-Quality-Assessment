import React from 'react';

const TimelineItem = ({ title, description, icon }) => (
  <div className="timeline-item">
    <div className="timeline-icon">{icon}</div>
    <h3 className="timeline-item-title">{title}</h3>
    <p className="timeline-item-description">{description}</p>
  </div>
);

const TeamMemberCard = ({ name, position, linkedin }) => (
  <div className="team-member-card">
    <h3 className="team-member-name">{name}</h3>
    <p className="team-member-position">{position}</p>
    <a href={linkedin} target="_blank" rel="noopener noreferrer" className="team-member-linkedin">
      Connect on LinkedIn
    </a>
  </div>
);

const ProjectInfo = () => {
  const teamMembers = [
    {
      name: "Aayush Adhikari",
      position: "IOE WRC, Pokhara",
      linkedin: "https://linkedin.com/in/aayushadhikari"
    },
    {
      name: "Shishir Sharma Rijal",
      position: "IOE WRC, Pokhara",
      linkedin: "https://linkedin.com/in/shishirrijal"
    },
    {
      name: "Roshan Tiwari",
      position: "IOE WRC, Pokhara",
      linkedin: "https://linkedin.com/in/roshanttiwari"
    },
    {
      name: "Sudip Acharya",
      position: "IOE WRC, Pokhara",
      linkedin: "https://linkedin.com/in/sudip-acharya-506737195"
    }
  ];

  return (
    <section id="project-info" className="landing-section">
      <div className="section-header animate-fade-in">
        <h2>About Our <span className="text-gradient">Final Year Project</span></h2>
        <p className="section-subtitle">Advancing Nepali speech technology through research and innovation</p>
      </div>
      
      <div className="project-container fade-in-up">
        <div className="project-overview glass-effect">
          <div className="project-content animate-slide-up">
            <p className="highlight-text fade-in">
              Our comprehensive final year project focuses on advancing Nepali Text-to-Speech technology
              through innovative research and development.
            </p>
            
            <div className="timeline-container stagger-fade-in">
              <TimelineItem 
                title="Our Research Journey"
                description="Throughout this year-long project, we've meticulously explored various TTS approaches, experimented with different models, developed custom phoneme sets, and created our own comprehensive Nepali speech dataset."
                icon="🔬"
              />
              
              <TimelineItem 
                title="System Development"
                description="We've developed a complete end-to-end TTS pipeline specifically optimized for Nepali language, incorporating cutting-edge deep learning techniques while addressing language-specific challenges."
                icon="⚙️"
              />
              
              <TimelineItem 
                title="Current Evaluation Phase"
                description="After extensive testing and refinement, we've developed several TTS models that are now ready for evaluation through this human assessment platform."
                icon="📊"
              />
            </div>
          </div>
        </div>

        <div className="team-section">
          <h2 className="section-title">Meet Our Team</h2>
          <div className="team-members-grid">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index} {...member} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectInfo;