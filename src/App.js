import { useState, useEffect, useRef } from 'react';
import About from './About';
import Experience from './Experience';
import Gallery from './Gallery';
import Testimonials from './Testimonials';
import Contact from './Contact';

// Fix: Use a reliable video URL or local path that exists
// If you have a local video, ensure it's in the public/videos folder
const heroVideo = '/videos/virtual-tour-vigan.mp4';

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Space Grotesk', sans-serif;
    background: #000;
    overflow-x: hidden;
  }
  
  html, body, #root {
    width: 100%;
    height: 100%;
  }
  
  /* Hero Section - Fullscreen without gaps */
  .hero-section {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }
  
  .hero-video-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  /* Critical fix: video covers EVERYTHING, no black bars */
  .hero-video {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 150%;
    min-height: 150%;
    width: auto;
    height: auto;
    object-fit: cover;
  }
  
  /* Fallback gradient if video fails - no empty space */
  .hero-video-fallback {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0a0a2a 0%, #000 100%);
  }
  
  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }
  
  .hero-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    text-align: center;
    padding: 0px;
  }
  
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .hero-letter, .hero-sub-word {
    display: inline-block;
    opacity: 0;
    animation: fadeUp 0.4s ease forwards;
  }
  
  .hero-sub-word {
    margin-right: 8px;
  }
  
  .cursor-blink {
    animation: blink 1s infinite;
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  
  .scroll-indicator {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    z-index: 2;
    opacity: 0.7;
  }
  
  .scroll-indicator span {
    font-size: 12px;
    letter-spacing: 2px;
    color: #fff;
  }
  
  .scroll-indicator-line {
    width: 2px;
    height: 40px;
    background: #fff;
    animation: scrollBounce 1.5s infinite;
  }
  
  @keyframes scrollBounce {
    0%, 100% { transform: translateY(0); opacity: 0.3; }
    50% { transform: translateY(10px); opacity: 1; }
  }
  
  .btn-blue, .btn-outline-blue {
    padding: 12px 28px;
    font-size: 0.9rem;
    font-weight: 600;
    border-radius: 40px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
    font-family: 'Space Grotesk', sans-serif;
    border: none;
  }
  
  .btn-blue {
    background: #3391ff;
    color: #fff;
    border: 1px solid #3391ff;
  }
  
  .btn-blue:hover {
    background: transparent;
    color: #3391ff;
    transform: translateY(-3px);
  }
  
  .btn-outline-blue {
    background: transparent;
    color: #3391ff;
    border: 1px solid #3391ff;
  }
  
  .btn-outline-blue:hover {
    background: #3391ff;
    color: #fff;
    transform: translateY(-3px);
  }
  
  .project-card {
    background: #111;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .project-card:hover {
    transform: translateY(-8px);
    border-color: #3391ff;
    box-shadow: 0 10px 30px rgba(51, 145, 255, 0.2);
  }
  
  .project-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .project-card-button {
    color: #3391ff;
    font-size: 0.85rem;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .project-card:hover .project-card-button {
    transform: translateX(5px);
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(5px);
  }
  
  .modal-content-box {
    background: #111;
    max-width: 600px;
    width: 90%;
    padding: 30px;
    border-radius: 20px;
    text-align: center;
    position: relative;
    border: 1px solid rgba(51, 145, 255, 0.3);
  }
  
  .modal-close-btn {
    position: absolute;
    top: 15px;
    right: 20px;
    font-size: 2rem;
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    transition: color 0.3s;
  }
  
  .modal-close-btn:hover {
    color: #3391ff;
  }
  
  .modal-img {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 20px;
  }
  
  #scroll-top-btn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #3391ff;
    color: #fff;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    transition: all 0.3s ease;
    z-index: 99;
    opacity: 0;
    visibility: hidden;
  }
  
  #scroll-top-btn.visible {
    opacity: 1;
    visibility: visible;
  }
  
  #scroll-top-btn:hover {
    transform: translateY(-5px);
    background: #fff;
    color: #3391ff;
  }
  
  .nav-link-item {
    background: none;
    border: none;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.3s;
    font-family: 'Space Grotesk', sans-serif;
  }
  
  .nav-link-item:hover {
    color: #fff !important;
  }
  
  @media (max-width: 991px) {
    .desktop-nav {
      display: none !important;
    }
    .hamburger {
      display: block !important;
    }
  }
  
  @media (max-width: 768px) {
    .btn-blue, .btn-outline-blue {
      padding: 10px 20px;
      font-size: 0.8rem;
    }
  }
`;

const PROJECTS = [
  { id: 1, img: '/PNGFILE/PORTRAIT.jpg', title: 'Portrait Retouch', desc: 'Professional portrait retouching with skin smoothing and color grading.', link: '/project/portrait-retouch' },
  { id: 2, img: '/PNGFILE/TRIPPLE EXPOSURE 1.jpg', title: 'Triple Exposure I', desc: 'Creative triple exposure photo compositing effect.', link: '/project/triple-exposure-1' },
  { id: 3, img: '/PNGFILE/TRIPPLE EXPOSURE 2.jpg', title: 'Triple Exposure II', desc: 'Second series of triple exposure artistic photography.', link: '/project/triple-exposure-2' },
  { id: 4, img: '/PNGFILE/Untitled-1.png', title: 'Coffee Shop Brand', desc: 'Logo and brand identity for The Daily Grind Coffee Shop.', link: '/project/coffee-shop-brand' },
  { id: 5, img: '', title: 'Project 5', desc: 'Description for project 5 goes here.', link: '/project/5' },
  { id: 6, img: '/PNGFILE/TEATEA.png', title: 'Teazy Taste', desc: 'Brand design and visual identity for a milk tea business.', link: '/project/teazy-taste' },
  { id: 7, img: '/PNGFILE/peanut sarap.png', title: 'Peanut Sarap', desc: 'Product packaging and marketing design for local snack brand.', link: '/project/peanut-sarap' },
  { id: 8, img: '/PNGFILE/ginatang kuhol.png', title: 'Ginatang Kuhol', desc: 'Food photography and visual design for local delicacy.', link: '/project/ginatang-kuhol' },
  { id: 9, img: '/PNGFILE/PROJECT9.jpg', title: 'Project 9', desc: 'Description for project 9 goes here.', link: '/project/9' },
  { id: 10, img: '/PNGFILE/MILKTEA 3.jpg', title: 'Milk Tea Campaign', desc: 'Marketing visuals and promotional design for milk tea brand.', link: '/project/milk-tea-campaign' },
];

// Typing effect hook
function useTypingEffect(words) {
  const [text, setText] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout;
    
    if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % words.length);
    } else {
      const next = deleting ? charIdx - 1 : charIdx + 1;
      timeout = setTimeout(() => {
        setText(current.substring(0, next));
        setCharIdx(next);
      }, deleting ? 50 : 100);
    }
    
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words]);

  return text;
}

// Modal Component
function Modal({ project, onClose }) {
  if (!project) return null;
  
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content-box">
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <img 
          className="modal-img" 
          src={project.img || 'https://via.placeholder.com/800x500?text=No+Image'} 
          alt={project.title} 
          onError={(e) => { e.target.src = 'https://via.placeholder.com/800x500?text=No+Image'; }}
        />
        <h2 style={{ marginBottom: '12px', color: '#3391ff' }}>{project.title}</h2>
        <p style={{ color: '#ccc', marginBottom: '20px', lineHeight: 1.6 }}>{project.desc}</p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <a href={project.link} className="btn-blue">View More</a>
          <a href={project.link} className="btn-outline-blue">Full Project</a>
        </div>
      </div>
    </div>
  );
}

// Mobile Navigation
function MobileNav({ open, onClose, navigate }) {
  if (!open) return null;
  
  const go = (page) => {
    navigate(page);
    onClose();
  };
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: '#0a0a0a',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '30px',
          fontSize: '2.5rem',
          cursor: 'pointer',
          color: '#3391ff',
          background: 'none',
          border: 'none',
        }}
      >
        ×
      </button>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '25px' }}>
        {['about', 'experience', 'gallery', 'testimonials', 'contact', 'portfolio'].map((page) => (
          <button
            key={page}
            onClick={() => go(page)}
            style={{
              fontSize: '1.5rem',
              color: '#3391ff',
              fontWeight: '600',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'color 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#3391ff')}
          >
            {page.charAt(0).toUpperCase() + page.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

// Navbar Component
function Navbar({ currentPage, navigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const NAV_LINKS = ['about', 'experience', 'gallery', 'testimonials', 'contact', 'portfolio'];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 100,
        background: scrolled ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.5)',
        backdropFilter: scrolled ? 'blur(10px)' : 'blur(5px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'all 0.3s ease',
      }}>
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 5%',
          height: '70px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          <button
            onClick={() => navigate('home')}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#3391ff',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            MySite
          </button>
          
          <div style={{ display: 'flex', gap: '35px', alignItems: 'center' }} className="desktop-nav">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                className="nav-link-item"
                onClick={() => navigate(link)}
                style={{ color: currentPage === link ? '#fff' : '#3391ff' }}
              >
                {link.charAt(0).toUpperCase() + link.slice(1)}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setMobileOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.8rem',
              color: '#3391ff',
              display: 'none',
            }}
            className="hamburger"
          >
            ☰
          </button>
        </nav>
      </header>
      
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} navigate={navigate} />
    </>
  );
}

// Animated Letters Component
function AnimatedLetters({ text, baseDelay = 0, color }) {
  return (
    <>
      {[...text].map((ch, i) => (
        <span
          key={i}
          className="hero-letter"
          style={{
            animationDelay: `${baseDelay + i * 0.05}s`,
            color: color || 'inherit',
          }}
        >
          {ch === ' ' ? '\u00a0' : ch}
        </span>
      ))}
    </>
  );
}

// Animated Words Component
function AnimatedWords({ text, baseDelay = 0 }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <span
          key={i}
          className="hero-sub-word"
          style={{ animationDelay: `${baseDelay + i * 0.07}s` }}
        >
          {word}
        </span>
      ))}
    </>
  );
}

// Portfolio Component (was missing)
function Portfolio({ navigate }) {
  const [activeModal, setActiveModal] = useState(null);
  
  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '120px 20px 80px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          marginBottom: '20px',
          color: '#3391ff',
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
        }}>
          My Portfolio
        </h2>
        <p style={{
          textAlign: 'center',
          color: '#ccc',
          maxWidth: '600px',
          margin: '0 auto 60px',
          fontSize: '1rem',
        }}>
          Here's a collection of my best work. Click on any project to see more details.
        </p>
        
        <div className="projects-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '30px',
        }}>
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="project-card"
              onClick={() => setActiveModal(project)}
            >
              <img
                src={project.img || 'https://via.placeholder.com/400x300?text=Project+Image'}
                alt={project.title}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
              />
              <div style={{ padding: '20px' }}>
                <h3 style={{ color: '#fff', marginBottom: '8px', fontSize: '1.1rem' }}>
                  {project.title}
                </h3>
                <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '15px', lineHeight: 1.5 }}>
                  {project.desc}
                </p>
                <div className="project-card-button">
                  View Details →
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <button className="btn-outline-blue" onClick={() => navigate('home')}>
            Back to Home
          </button>
        </div>
      </div>
      
      <Modal project={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
}

// Home Component
function Home({ navigate }) {
  const typed = useTypingEffect(['UI/UX Designer', 'Photo Retoucher', 'Marketing Artist']);
  const [activeModal, setActiveModal] = useState(null);
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force video to play and cover full area
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('playsinline', 'true');

    const attemptPlay = async () => {
      try {
        await video.play();
      } catch (err) {
        console.log('Auto-play prevented:', err);
        setVideoError(true);
        // Try to play on user interaction
        const playOnInteraction = () => {
          video.play().catch(e => console.log('Still failed:', e));
          document.removeEventListener('click', playOnInteraction);
          document.removeEventListener('touchstart', playOnInteraction);
          document.removeEventListener('scroll', playOnInteraction);
        };
        document.addEventListener('click', playOnInteraction);
        document.addEventListener('touchstart', playOnInteraction);
        document.addEventListener('scroll', playOnInteraction);
      }
    };

    const handleError = () => {
      console.error('Video failed to load');
      setVideoError(true);
    };
    
    video.addEventListener('error', handleError);
    
    const timer = setTimeout(attemptPlay, 100);

    return () => {
      clearTimeout(timer);
      video.removeEventListener('error', handleError);
      if (video) {
        video.pause();
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const titleEndDelay = 0.3 + ('I Am a'.length - 1) * 0.05 + 0.3;
  const subDelay = titleEndDelay + 0.2;

  return (
    <div style={{ background: '#000', color: '#fff' }}>
      
      {/* HERO SECTION */}
      <div className="hero-section">
        <div className="hero-video-container">
          {!videoError ? (
            <video
              ref={videoRef}
              className="hero-video"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
          ) : (
            <div className="hero-video-fallback" />
          )}
        </div>
        
        <div className="hero-overlay" />
        
        <div className="hero-content">
          <div style={{ maxWidth: '800px', width: '90%' }}>
            <h3 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '1rem',
              color: '#3391ff',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '20px',
              opacity: 0,
              animation: 'fadeUp 0.6s ease forwards',
              animationDelay: '0.1s',
            }}>
              HI THERE! 👋
            </h3>
            
            <h1 className="hero-title" style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#fff',
              marginBottom: '15px',
            }}>
              <AnimatedLetters text="I Am a" baseDelay={0.3} color="#fff" />
            </h1>
            
            <div className="hero-typed" style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              fontWeight: 800,
              color: '#3391ff',
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              opacity: 0,
              animation: 'fadeUp 0.5s ease forwards',
              animationDelay: `${titleEndDelay}s`,
            }}>
              <span>{typed}</span>
              <span className="cursor-blink" style={{
                display: 'inline-block',
                width: '3px',
                height: '1em',
                background: '#3391ff',
              }} />
            </div>
            
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              lineHeight: 1.7,
              maxWidth: '550px',
              margin: '0 auto 40px',
            }}>
              <AnimatedWords
                text="Creative web developer & graphic designer from the Philippines. I craft beautiful visuals and responsive digital experiences."
                baseDelay={subDelay}
              />
            </p>
            
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              opacity: 0,
              animation: 'fadeUp 0.6s ease forwards',
              animationDelay: `${subDelay + 1.2}s`,
            }}>
              <button className="btn-blue" onClick={() => navigate('about')}>
                About Me 👤
              </button>
              <button className="btn-outline-blue" onClick={() => navigate('portfolio')}>
                View My Work
              </button>
            </div>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <span>SCROLL</span>
          <div className="scroll-indicator-line" />
        </div>
      </div>
      
      {/* ABOUT SECTION */}
      <section style={{
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        minHeight: '100vh',
      }}>
        <div style={{
          flex: 1,
          minWidth: '300px',
          minHeight: '500px',
          background: "url('/PNGFILE/profile.jpg') no-repeat center center / cover",
        }} />
        <div style={{
          flex: 1,
          minWidth: '300px',
          background: '#111',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px',
        }}>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 800,
            color: '#3391ff',
            marginBottom: '20px',
          }}>
            About Me
          </h1>
          <div style={{
            width: '60px',
            height: '3px',
            background: '#3391ff',
            marginBottom: '30px',
          }} />
          <p style={{
            fontSize: '1rem',
            lineHeight: 1.7,
            color: '#ccc',
            marginBottom: '30px',
          }}>
            I'm Nathaniel Tolentino Oliver II, a creative web developer and designer from the Philippines.
            With a strong eye for design and a passion for coding, I specialize in building responsive,
            modern websites and web applications that leave a lasting impression.
          </p>
          <ul style={{
            listStyle: 'none',
            marginBottom: '40px',
          }}>
            <li style={{ marginBottom: '12px', color: '#ccc' }}>
              <strong style={{ color: '#3391ff' }}>📍 Location:</strong> Magsingal, Ilocos Sur, Philippines
            </li>
            <li style={{ marginBottom: '12px', color: '#ccc' }}>
              <strong style={{ color: '#3391ff' }}>📧 Email:</strong> nathaniel@example.com
            </li>
            <li style={{ marginBottom: '12px', color: '#ccc' }}>
              <strong style={{ color: '#3391ff' }}>📱 Phone:</strong> +63 XXX XXX XXXX
            </li>
            <li style={{ color: '#ccc' }}>
              <strong style={{ color: '#3391ff' }}>⚡ Skills:</strong> HTML, CSS, JS, React, Photoshop, Lightroom
            </li>
          </ul>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
            <button className="btn-outline-blue" onClick={() => navigate('portfolio')}>
              Explore My Work
            </button>
            <a href="./Nathaniel_Oliver_CV.pdf" target="_blank" rel="noreferrer" className="btn-blue">
              Download CV 📄
            </a>
          </div>
        </div>
      </section>
      
      {/* FEATURED PROJECTS */}
      <section style={{ padding: '80px 20px', background: '#000' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            marginBottom: '50px',
            color: '#fff',
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
          }}>
            Featured Portfolio Projects
          </h2>
          
          <div className="projects-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '25px',
          }}>
            {PROJECTS.slice(0, 6).map((project) => (
              <div
                key={project.id}
                className="project-card"
                onClick={() => setActiveModal(project)}
              >
                <img
                  src={project.img || 'https://via.placeholder.com/400x300?text=Project+Image'}
                  alt={project.title}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
                <div style={{ padding: '20px' }}>
                  <h3 style={{ color: '#fff', marginBottom: '8px', fontSize: '1.1rem' }}>
                    {project.title}
                  </h3>
                  <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '15px', lineHeight: 1.5 }}>
                    {project.desc}
                  </p>
                  <div className="project-card-button">
                    View Details →
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <button className="btn-blue" onClick={() => navigate('portfolio')}>
              View All Projects
            </button>
          </div>
        </div>
      </section>
      
      <Modal project={activeModal} onClose={() => setActiveModal(null)} />
      
      <button
        id="scroll-top-btn"
        className={showScrollTop ? 'visible' : ''}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>
    </div>
  );
}

// Main App Component
export default function App() {
  const [page, setPage] = useState('home');

  const navigate = (pageId) => {
    setPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <Home navigate={navigate} />;
      case 'about':
        return <About navigate={navigate} />;
      case 'experience':
        return <Experience />;
      case 'gallery':
        return <Gallery />;
      case 'testimonials':
        return <Testimonials />;
      case 'contact':
        return <Contact />;
      case 'portfolio':
        return <Portfolio navigate={navigate} />;
      default:
        return <Home navigate={navigate} />;
    }
  };

  return (
    <div style={{
      background: '#000',
      minHeight: '100vh',
      width: '100%',
      overflowX: 'hidden',
    }}>
      <style>{GLOBAL_STYLES}</style>
      <Navbar currentPage={page} navigate={navigate} />
      <main>{renderPage()}</main>
      <footer style={{
        padding: '40px 5%',
        background: '#030305',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        textAlign: 'center',
      }}>
        <p style={{ color: '#666', fontSize: '0.85rem' }}>
          © {new Date().getFullYear()} — All rights reserved.
        </p>
      </footer>
    </div>
  );
}
