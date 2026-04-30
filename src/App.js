import { useState, useEffect, useRef } from 'react';
import About from './About';
import Contact from './Contact'; 
import Portfolio from './Portfolio';

const heroVideo = '/videos/virtual-tour-vigan.mp4';

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Space Grotesk', sans-serif;
    background: #000;
    color: #fff;
  }

  /* Navigation Styles */
  .nav-link-item {
    color: #3391ff;
    font-weight: 600;
    font-size: 0.95rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px 0;
    transition: color 0.3s ease;
    text-decoration: none;
    position: relative;
  }

  .nav-link-item::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: #3391ff;
    transition: width 0.3s ease;
  }

  .nav-link-item:hover::after {
    width: 100%;
  }

  .nav-link-item:hover {
    color: #fff;
  }

  /* Button Styles */
  .btn-blue {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 32px;
    border: 2px solid #3391ff;
    background: #3391ff;
    color: #fff;
    font-weight: 600;
    font-size: 0.95rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    font-family: inherit;
  }

  .btn-blue:hover {
    background: #2673cc;
    border-color: #2673cc;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(51, 145, 255, 0.2);
  }

  .btn-outline-blue {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 32px;
    border: 2px solid #3391ff;
    background: transparent;
    color: #3391ff;
    font-weight: 600;
    font-size: 0.95rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: inherit;
  }

  .btn-outline-blue:hover {
    background: #3391ff;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(51, 145, 255, 0.2);
  }

  /* Project Card Styles */
  .project-card {
    background: #111;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .project-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 30px rgba(0, 0, 0, 0.3);
  }

  .project-card img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
  }

  .project-card:hover img {
    transform: scale(1.05);
  }

  .project-card-button {
    margin-top: 12px;
    display: inline-block;
    background: #3391ff;
    color: #fff;
    padding: 8px 20px;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: background 0.3s ease;
  }

  .project-card-button:hover {
    background: #2673cc;
  }

  /* Modal Styles */
  .modal-overlay {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    z-index: 9999;
    justify-content: center;
    align-items: center;
    padding: 20px;
    backdrop-filter: blur(5px);
  }

  .modal-content-box {
    background: linear-gradient(135deg, #1a1a2e 0%, #111 100%);
    color: #fff;
    padding: 30px;
    border-radius: 20px;
    max-width: 800px;
    width: 100%;
    text-align: center;
    position: relative;
    overflow: auto;
    max-height: 90vh;
    border: 1px solid rgba(51, 145, 255, 0.2);
  }

  .modal-close-btn {
    position: absolute;
    top: 15px;
    right: 20px;
    font-size: 2rem;
    color: #fff;
    cursor: pointer;
    background: rgba(51, 145, 255, 0.2);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    transition: background 0.3s;
  }

  .modal-close-btn:hover {
    background: #3391ff;
  }

  .modal-img {
    width: 100%;
    max-height: 60vh;
    object-fit: contain;
    border-radius: 12px;
    margin-bottom: 20px;
  }

  /* Scroll Top Button */
  #scroll-top-btn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: #3391ff;
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 22px;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(51, 145, 255, 0.4);
    z-index: 999;
    transition: all 0.3s ease;
  }

  #scroll-top-btn:hover {
    background: #2673cc;
    transform: scale(1.1);
  }

  /* Animations */
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  @keyframes floatDown {
    0%, 100% {
      transform: translateX(-50%) translateY(0);
    }
    50% {
      transform: translateX(-50%) translateY(10px);
    }
  }

  @keyframes letterIn {
    from {
      opacity: 0;
      transform: translateY(40px) rotate(6deg);
    }
    to {
      opacity: 1;
      transform: translateY(0) rotate(0deg);
    }
  }

  @keyframes wordIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .cursor-blink {
    animation: blink 0.75s step-end infinite;
  }

  .hero-letter {
    display: inline-block;
    opacity: 0;
    transform: translateY(40px) rotate(6deg);
    animation: letterIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  .hero-sub-word {
    display: inline-block;
    opacity: 0;
    transform: translateY(20px);
    animation: wordIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    margin-right: 0.3em;
  }

  .scroll-indicator {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    z-index: 10;
    opacity: 0.7;
    animation: floatDown 2s ease-in-out infinite;
  }

  .scroll-indicator span {
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #3391ff;
    font-weight: 500;
  }

  .scroll-indicator-line {
    width: 1px;
    height: 50px;
    background: linear-gradient(to bottom, #3391ff, transparent);
  }

  /* FULL SCREEN HERO SECTION - NO BLACK BARS */
  .hero-section {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }

  /* Video container that fills the entire screen */
  .hero-video-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 150%;
    min-height: 150%;
    width: auto;
    height: auto;
    overflow: hidden;
  }

  /* Video that covers the entire screen without black bars */
  .hero-video {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    object-fit: cover;
  }

  /* Dark overlay for text readability */
  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.55);
    z-index: 1;
  }

  /* Content wrapper */
  .hero-content {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 20px;
  }

  /* Ensure body and root take full width */
  #root {
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.5rem !important;
    }
    .hero-typed {
      font-size: 1.8rem !important;
    }
    .projects-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    .about-section {
      flex-direction: column;
    }
    .about-left {
      min-height: 350px;
    }
    .about-right {
      padding: 40px 24px !important;
    }
  }

  @media (max-width: 480px) {
    .projects-grid {
      grid-template-columns: 1fr !important;
    }
  }
`;

const PROJECTS = [
  { id: 1, img: './PNGFILE/PORTRAIT.jpg', title: 'Portrait Retouch', desc: 'Professional portrait retouching with skin smoothing and color grading.', link: './dsfgh.html' },
  { id: 2, img: './PNGFILE/TRIPPLE EXPOSURE 1.jpg', title: 'Triple Exposure I', desc: 'Creative triple exposure photo compositing effect.', link: './dsfgh.html' },
  { id: 3, img: './PNGFILE/TRIPPLE EXPOSURE 2.jpg', title: 'Triple Exposure II', desc: 'Second series of triple exposure artistic photography.', link: './dsfgh.html' },
  { id: 4, img: './PNGFILE/Untitled-1.png', title: 'Coffee Shop Brand', desc: 'Logo and brand identity for The Daily Grind Coffee Shop.', link: './THE DAILY GRIND COFFEE SHOP.html' },
  { id: 5, img: '', title: 'Project 5', desc: 'Description for project 5 goes here.', link: './dsfgh.html' },
  { id: 6, img: './PNGFILE/TEATEA.png', title: 'Teazy Taste', desc: 'Brand design and visual identity for a milk tea business.', link: './teazy taste.html' },
  { id: 7, img: './PNGFILE/peanut sarap.png', title: 'Peanut Sarap', desc: 'Product packaging and marketing design for local snack brand.', link: './dsfgh.html' },
  { id: 8, img: './PNGFILE/ginatang kuhol.png', title: 'Ginatang Kuhol', desc: 'Food photography and visual design for local delicacy.', link: './dsfgh.html' },
  { id: 9, img: './PNGFILE/PROJECT9.jpg', title: 'Project 9', desc: 'Description for project 9 goes here.', link: './dsfgh.html' },
  { id: 10, img: './PNGFILE/MILKTEA 3.jpg', title: 'Milk Tea Campaign', desc: 'Marketing visuals and promotional design for milk tea brand.', link: './dsfgh.html' },
];

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
        />
        <h2 style={{ marginBottom: '12px', color: '#3391ff' }}>{project.title}</h2>
        <p style={{ color: '#ccc', marginBottom: '20px', lineHeight: 1.6 }}>{project.desc}</p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <a href={project.link} target="_blank" rel="noreferrer" className="btn-blue">View More</a>
          <a href={project.link} target="_blank" rel="noreferrer" className="btn-outline-blue">Full Project</a>
        </div>
      </div>
    </div>
  );
}

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
            onMouseEnter={(e) => (e.target.style.color = '#fff')}
            onMouseLeave={(e) => (e.target.style.color = '#3391ff')}
          >
            {page.charAt(0).toUpperCase() + page.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

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
      
      <style>
        {`
          @media (max-width: 991px) {
            .desktop-nav { display: none !important; }
            .hamburger { display: block !important; }
          }
        `}
      </style>
      
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} navigate={navigate} />
    </>
  );
}

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

// Experience Component
function Experience() {
  const experiences = [
    {
      year: '2022 - Present',
      title: 'Senior UI/UX Designer',
      company: 'Creative Studio PH',
      desc: 'Leading design projects, creating user-centered interfaces, and mentoring junior designers.'
    },
    {
      year: '2020 - 2022',
      title: 'Graphic Designer',
      company: 'Digital Arts Inc.',
      desc: 'Designed marketing materials, social media graphics, and brand identities for clients.'
    },
    {
      year: '2018 - 2020',
      title: 'Freelance Designer',
      company: 'Self-employed',
      desc: 'Provided web design, photo retouching, and branding services to various clients.'
    }
  ];

  return (
    <div style={{ paddingTop: '100px', background: '#000', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 800,
          textAlign: 'center',
          marginBottom: '20px',
          color: '#3391ff'
        }}>
          Experience
        </h1>
        <div style={{ width: '80px', height: '3px', background: '#3391ff', margin: '0 auto 50px' }} />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {experiences.map((exp, idx) => (
            <div key={idx} style={{
              background: '#111',
              borderRadius: '16px',
              padding: '30px',
              transition: 'transform 0.3s ease',
              border: '1px solid rgba(51, 145, 255, 0.1)',
            }}>
              <div style={{ color: '#3391ff', fontWeight: 600, marginBottom: '10px' }}>{exp.year}</div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '5px', color: '#fff' }}>{exp.title}</h2>
              <h3 style={{ color: '#888', marginBottom: '15px', fontSize: '1rem' }}>{exp.company}</h3>
              <p style={{ color: '#ccc', lineHeight: 1.6 }}>{exp.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Gallery Component
function Gallery() {
  const galleryImages = [
    { id: 1, src: './PNGFILE/PORTRAIT.jpg', title: 'Portrait Work' },
    { id: 2, src: './PNGFILE/TRIPPLE EXPOSURE 1.jpg', title: 'Triple Exposure' },
    { id: 3, src: './PNGFILE/TRIPPLE EXPOSURE 2.jpg', title: 'Creative Composite' },
    { id: 4, src: './PNGFILE/TEATEA.png', title: 'Brand Design' },
    { id: 5, src: './PNGFILE/peanut sarap.png', title: 'Packaging Design' },
    { id: 6, src: './PNGFILE/ginatang kuhol.png', title: 'Food Photography' },
  ];

  return (
    <div style={{ paddingTop: '100px', background: '#000', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 800,
          textAlign: 'center',
          marginBottom: '20px',
          color: '#3391ff'
        }}>
          Gallery
        </h1>
        <div style={{ width: '80px', height: '3px', background: '#3391ff', margin: '0 auto 50px' }} />
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '25px',
        }}>
          {galleryImages.map((img) => (
            <div key={img.id} style={{
              background: '#111',
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'transform 0.3s ease',
            }}>
              <img 
                src={img.src} 
                alt={img.title}
                style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x250?text=Image+Not+Found';
                }}
              />
              <div style={{ padding: '15px' }}>
                <h3 style={{ color: '#fff' }}>{img.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Testimonials Component
function Testimonials() {
  const testimonials = [
    {
      id: 1,
      text: "Nathaniel is an exceptional designer! His attention to detail and creative vision brought our brand to life. Highly recommended!",
      author: "Maria Santos",
      role: "CEO, Creative Studio"
    },
    {
      id: 2,
      text: "Working with Nathaniel was a pleasure. He delivered high-quality work on time and exceeded our expectations.",
      author: "John Rivera",
      role: "Marketing Director"
    },
    {
      id: 3,
      text: "The website Nathaniel built for us is stunning and performs flawlessly. His technical skills are top-notch.",
      author: "Anna Cruz",
      role: "Business Owner"
    }
  ];

  return (
    <div style={{ paddingTop: '100px', background: '#000', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 800,
          textAlign: 'center',
          marginBottom: '20px',
          color: '#3391ff'
        }}>
          Testimonials
        </h1>
        <div style={{ width: '80px', height: '3px', background: '#3391ff', margin: '0 auto 50px' }} />
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '30px',
        }}>
          {testimonials.map((t) => (
            <div key={t.id} style={{
              background: '#111',
              borderRadius: '16px',
              padding: '30px',
              border: '1px solid rgba(51, 145, 255, 0.1)',
            }}>
              <p style={{ color: '#ccc', lineHeight: 1.6, marginBottom: '20px', fontStyle: 'italic' }}>
                "{t.text}"
              </p>
              <div>
                <h3 style={{ color: '#3391ff', marginBottom: '5px' }}>{t.author}</h3>
                <p style={{ color: '#888', fontSize: '0.85rem' }}>{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Home({ navigate }) {
  const typed = useTypingEffect(['UI/UX Designer', 'Photo Retoucher', 'Marketing Artist']);
  const [activeModal, setActiveModal] = useState(null);
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);

  // Initialize video for full screen playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

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
    
    // Small delay to ensure video is ready
    const timer = setTimeout(attemptPlay, 100);

    return () => {
      clearTimeout(timer);
      video.removeEventListener('error', handleError);
      if (video) {
        video.pause();
      }
    };
  }, []);

  const titleEndDelay = 0.3 + ('I Am a'.length - 1) * 0.05 + 0.3;
  const subDelay = titleEndDelay + 0.2;

  return (
    <div style={{ background: '#000', color: '#fff' }}>
      
      {/* HERO SECTION - FULL SCREEN VIDEO WITH NO BLACK BARS */}
      <div className="hero-section">
        
        {/* Video Container - fills entire screen */}
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
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #0a0a2a 0%, #000 100%)',
            }} />
          )}
        </div>
        
        {/* Dark Overlay for better text readability */}
        <div className="hero-overlay" />
        
        {/* Content */}
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
        
        {/* Scroll Indicator */}
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
          background: "url('./PNGFILE/profile.jpg') no-repeat center center / cover",
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
            <button className="btn-blue" onClick={() => navigate('portfolio')}>
              View All Projects
            </button>
          </div>
        </div>
      </section>
      
      <Modal project={activeModal} onClose={() => setActiveModal(null)} />
      
      {/* Scroll to Top Button */}
      <button
        id="scroll-top-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>
    </div>
  );
}

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
        return <Portfolio />;
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
      <main key={page}>{renderPage()}</main>
      <footer style={{
        padding: '40px 5%',
        background: '#030305',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        textAlign: 'center',
      }}>
        <p style={{ color: '#666', fontSize: '0.85rem' }}>
          © {new Date().getFullYear()} Nathaniel Oliver — All rights reserved.
        </p>
      </footer>
    </div>
  );
}
