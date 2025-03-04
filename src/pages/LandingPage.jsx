import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

// Import icons
import ListenIcon from '../assets/icons/listen.svg';
import RateIcon from '../assets/icons/rate.svg';
import SubmitIcon from '../assets/icons/submit.svg';

function LandingPage() {
  // Refs for animations
  const heroRef = useRef(null);
  const stepsRef = useRef(null);
  const benefitsRef = useRef(null);
  const sphereRef = useRef(null);
  
  // Reduce number of characters and pre-calculate positions for better performance
  const nepaliChars = ['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ'];
  
  // Setup the 3D character sphere on mount with performance optimizations
  useEffect(() => {
    if (!sphereRef.current) return;
    
    const container = sphereRef.current;
    const radius = 120; // sphere radius
    const charElements = container.children;
    const total = charElements.length;
    let animationFrameId;
    let angle = 0;
    let lastTimestamp = 0;
    
    // Pre-calculate positions for smoother animation
    const positions = Array(total).fill().map((_, i) => {
      const theta = Math.acos(-1 + (2 * i) / total);
      const phi = Math.sqrt(total * Math.PI) * theta;
      return { theta, phi };
    });
    
    // Position characters in a sphere-like arrangement with optimizations
    const positionChars = (timestamp) => {
      // Throttle animation updates for better performance
      if (timestamp - lastTimestamp < 10) { // ~60fps
        animationFrameId = requestAnimationFrame(positionChars);
        return;
      }
      
      lastTimestamp = timestamp;
      angle += 0.008; // Reduced speed for smoother animation
      
      for (let i = 0; i < total; i++) {
        const { theta, phi } = positions[i];
        
        // Convert spherical to Cartesian coordinates
        let x = radius * Math.sin(theta + angle) * Math.cos(phi + angle * 0.5);
        let y = radius * Math.sin(theta + angle) * Math.sin(phi + angle * 0.5);
        let z = radius * Math.cos(theta + angle);
        
        // Apply position
        const el = charElements[i];
        const scale = (z + radius) / (2 * radius); // Scale based on z position
        
        // Use transform3d for hardware acceleration
        el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`;
        el.style.opacity = scale * 0.8 + 0.2;
        el.style.zIndex = Math.floor(scale * 100);
      }
      
      animationFrameId = requestAnimationFrame(positionChars);
    };
    
    // Initialize and start animation
    animationFrameId = requestAnimationFrame(positionChars);
    
    // Cleanup on unmount
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [nepaliChars.length]);
  
  // Animation for elements when they come into view
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    };
    
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    const sections = document.querySelectorAll('.animate-on-scroll');
    sections.forEach(section => {
      observer.observe(section);
    });
    
    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="landing-container">
      {/* Animated background */}
      <div className="animated-bg">
        <div className="animated-shape shape1"></div>
        <div className="animated-shape shape2"></div>
        <div className="animated-shape shape3"></div>
      </div>
      
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="#4361ee">
            <path d="M13 18h-2v-5H9v-2h2V9h2v2h2v2h-2z"/>
            <path d="M12 1a9 9 0 0 1 9 9v7a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3h4V9a7 7 0 1 0-14 0v1h4a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-7a9 9 0 0 1 9-9z"/>
          </svg>
          <span>Nepali TTS</span>
        </div>
        <div className="nav-links">
          <a href="#overview">Overview</a>
          <a href="#how-it-works">Process</a>
          <a href="#benefits">Benefits</a>
        </div>
        <Link to="/survey" className="nav-cta">
          Start Survey
        </Link>
      </nav>

      {/* Hero Section with dynamic animations */}
      <header className="landing-hero" ref={heroRef}>
        <div className="hero-content">
          {/* <div className="glowing-badge">New Research Project</div> */}
          <h1 className="hero-title">
            <span className="text-gradient">Nepali</span> Text-to-Speech
            <br />Quality Assessment
          </h1>
          <p className="tagline">Help us improve the future of Nepali voice synthesis!</p>
          <p className="hero-description">
            We are developing an advanced Nepali Text-to-Speech system and need your feedback 
            to improve the quality and naturalness of the voice. Your input will shape the 
            next generation of AI-powered voice technology for Nepal.
          </p>
          <div className="hero-cta-group">
            <Link to="/survey" className="cta-button primary-gradient">
              <span>Enter Survey</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <a href="#how-it-works" className="cta-button secondary">
              <span>Learn More</span>
            </a>
          </div>
          
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">45M+</div>
              <div className="stat-label">Nepali Speakers</div>
            </div>
            <div className="stat">
              <div className="stat-number">3+</div>
              <div className="stat-label">Voice Models</div>
            </div>
            <div className="stat">
              <div className="stat-number">4500+</div>
              <div className="stat-label">Audio Samples</div>
            </div>
          </div>
        </div>
        
        <div className="hero-image">
          
          <div className="main-illustration">
          <div className="sound-waves">
              <div className="wave wave1"></div>
              <div className="wave wave2"></div>
              <div className="wave wave3"></div>
            </div>
            
            <img src="/assets/images/tts-illustration.svg" alt="TTS Illustration" className="pulse-animation" />
            
          </div>

          <div className="floating-elements">
            <div className="floating-element f1">क</div>
            <div className="floating-element f2">ख</div>
            <div className="floating-element f3">ग</div>
            <div className="floating-element f4">घ</div>
            <div className="floating-element f5">ङ</div>
          </div>


        </div>
      </header>

      {/* Project Overview Section */}
      <section id="overview" className="landing-section project-overview animate-on-scroll">
        <div className="section-header">
          <h2>Project <span className="text-gradient">Overview</span></h2>
          <p className="section-subtitle">Building the future of Nepali voice technology</p>
        </div>
        
        <div className="overview-content">
          <div className="overview-text">
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#4361ee">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
              <div>
                <h3>Global Impact</h3>
                <p>
                  With over 45 million Nepali speakers worldwide, a reliable TTS system 
                  can improve accessibility, assist in education, and contribute to technological 
                  advancement in Nepal and beyond.
                </p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#4361ee">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
              <div>
                <h3>AI-Powered Voice Technology</h3>
                <p>
                  Our system uses state-of-the-art neural networks to generate human-like speech 
                  in Nepali. Your feedback helps train these models to sound more natural and expressive.
                </p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#4361ee">
                  <path d="M18 2h-8L4 8v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 15h-2v-2h2v2zm0-4h-2V8h2v5z" />
                </svg>
              </div>
              <div>
                <h3>Research & Development</h3>
                <p>
                  This project represents years of research and development in speech synthesis 
                  and natural language processing. Your participation helps push the boundaries of what's possible.
                </p>
              </div>
            </div>
          </div>
          
          <div className="overview-image">
            <div className="char-sphere-container">
              <div className="char-sphere" ref={sphereRef}>
                {nepaliChars.map((char, index) => (
                  <div 
                    key={index} 
                    className="nepali-char"
                  >
                    {char}
                  </div>
                ))}
              </div>
              <div className="glow-effect"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section with animated steps */}
      <section id="how-it-works" className="landing-section how-it-works animate-on-scroll" ref={stepsRef}>
        <div className="section-header">
          <h2>How It <span className="text-gradient">Works</span></h2>
          <p className="section-subtitle">Three simple steps to help improve our TTS system</p>
        </div>
        
        <div className="steps-container">
          <div className="step">
            <div className="step-icon">
              <div className="icon-background"></div>
              <img src={ListenIcon} alt="Listen Icon" />
            </div>
            <div className="step-count">01</div>
            <h3>Listen</h3>
            <p>Play the audio samples and listen carefully to the synthetic speech. Pay attention to pronunciation, rhythm, and naturalness.</p>
          </div>
          
          <div className="step-connector">
            <svg width="100%" height="4" viewBox="0 0 100 4">
              <line x1="0" y1="2" x2="100%" y2="2" stroke="#4361ee" strokeWidth="2" strokeDasharray="6 6" />
            </svg>
          </div>
          
          <div className="step">
            <div className="step-icon">
              <div className="icon-background"></div>
              <img src={RateIcon} alt="Rate Icon" />
            </div>
            <div className="step-count">02</div>
            <h3>Rate</h3>
            <p>Rate each sample from 1 to 10 based on its naturalness, clarity, and quality. Be honest with your assessments for the most accurate results.</p>
          </div>
          
          <div className="step-connector">
            <svg width="100%" height="4" viewBox="0 0 100 4">
              <line x1="0" y1="2" x2="100%" y2="2" stroke="#4361ee" strokeWidth="2" strokeDasharray="6 6" />
            </svg>
          </div>
          
          <div className="step">
            <div className="step-icon">
              <div className="icon-background"></div>
              <img src={SubmitIcon} alt="Submit Icon" />
            </div>
            <div class="step-count">03</div>
            <h3>Submit</h3>
            <p>Submit your ratings and feedback to help us improve the system. Your input directly influences how we train and refine our voice models.</p>
          </div>
        </div>
        
        {/* <div className="steps-cta">
          <Link to="/survey" className="cta-button primary-gradient">
            <span>Start Rating Now</span>
            <svg width="20" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div> */}
      </section>

      {/* Why Your Feedback Matters Section */}
      <section id="benefits" className="landing-section feedback-matters animate-on-scroll" ref={benefitsRef}>
        <div className="section-header">
          <h2>Why Your <span className="text-gradient">Feedback Matters</span></h2>
          <p className="section-subtitle">Your input shapes the future of voice technology in Nepal</p>
        </div>
        
        <div className="benefits-container">
          <div className="benefit-card">
            <div className="benefit-icon">
              <svg viewBox="0 0 24 24" width="40" height="40">
                <path fill="#4361ee" d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5-1.95 0-4.05.4-5.5 1.5v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
              </svg>
            </div>
            <h3>Education</h3>
            <p>
              Your feedback helps create TTS systems that can read educational content aloud, 
              benefiting students with visual impairments and supporting literacy programs in Nepal.
            </p>
            <div className="benefit-image">
              <div className="tech-dots"></div>
            </div>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">
              <svg viewBox="0 0 24 24" width="40" height="40">
                <path fill="#4361ee" d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
              </svg>
            </div>
            <h3>Accessibility</h3>
            <p>
              By improving the TTS system, you're helping make digital content accessible to 
              people with disabilities and those who cannot read Nepali text.
            </p>
            <div className="benefit-image">
              <div className="tech-dots"></div>
            </div>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">
              <svg viewBox="0 0 24 24" width="40" height="40">
                <path fill="#4361ee" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6zm-2 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
              </svg>
            </div>
            <h3>Innovation</h3>
            <p>
              Your input drives innovation in Nepali language technology, leading to better 
              voice assistants, navigation systems, and other voice-based applications.
            </p>
            <div className="benefit-image">
              <div className="tech-dots"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with animated cards
      <section className="landing-section testimonials animate-on-scroll">
        <div className="section-header">
          <h2>What <span className="text-gradient">Others Say</span></h2>
          <p className="section-subtitle">Feedback from our community of evaluators</p>
        </div>
        
        <div className="testimonials-container">
          <div className="testimonial">
            <div className="quote-mark">"</div>
            <p>I'm impressed by how natural the Nepali TTS system sounds. The voice flows just like a native speaker with proper intonation and rhythm. It's getting better with each update!</p>
            <div className="testimonial-footer">
              <div className="testimonial-avatar">
                <div className="avatar-placeholder">RS</div>
              </div>
              <div className="testimonial-author">
                <strong>Ramesh Sharma</strong>
                <span>Beta Tester</span>
              </div>
            </div>
          </div>
          
          <div className="testimonial">
            <div className="quote-mark">"</div>
            <p>This project is a significant step forward for Nepali language technology. As someone who studies linguistics, I can see how these voices are becoming increasingly natural and expressive.</p>
            <div className="testimonial-footer">
              <div className="testimonial-avatar">
                <div className="avatar-placeholder">SP</div>
              </div>
              <div className="testimonial-author">
                <strong>Dr. Sita Poudel</strong>
                <span>Linguistics Professor</span>
              </div>
            </div>
          </div>
          
          <div className="testimonial">
            <div className="quote-mark">"</div>
            <p>As a visually impaired person, this TTS system has opened up new digital opportunities for me. I can now access Nepali content online that was previously inaccessible. Thank you for this amazing work!</p>
            <div className="testimonial-footer">
              <div className="testimonial-avatar">
                <div className="avatar-placeholder">AT</div>
              </div>
              <div className="testimonial-author">
                <strong>Anup Tamang</strong>
                <span>User</span>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Call to Action Section */}
      <section className="landing-section final-cta animate-on-scroll">
        <div className="cta-card">
          <div className="cta-content">
            <h2>Ready to Help Improve Nepali TTS?</h2>
            <p>Your feedback is valuable and will help shape the future of this technology.</p>
            <Link to="/survey" className="cta-button large">
              <span>Start the Survey Now</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
          <div className="cta-decoration">
            <div className="tech-circle c1"></div>
            <div className="tech-circle c2"></div>
            <div className="tech-circle c3"></div>
            
          </div>
        </div>
      </section>

      {/* Footer with modern styling - simplified */}
      <footer className="landing-footer">
        
      {/* <div className="footer-logo">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="#4361ee">
                <path d="M13 18h-2v-5H9v-2h2V9h2v2h2v2h-2z"/>
                <path d="M12 1a9 9 0 0 1 9 9v7a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3h4V9a7 7 0 1 0-14 0v1h4a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-7a9 9 0 0 1 9-9z"/>
              </svg>
              <span>Nepali TTS</span>
            </div> */}
        <div className="footer-bottom">
          <p className="copyright">© {new Date().getFullYear()} Nepali TTS Project</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;