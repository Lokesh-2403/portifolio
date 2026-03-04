import { useEffect, useRef, useState } from 'react';
import { Shield, Network, Lock, BarChart2, Terminal, Award } from 'lucide-react';

const certs = [
  { step: 'Step 01', title: 'Google Cybersecurity Certificate', issuer: 'Google / Coursera',   icon: <Shield className="w-5 h-5" />,    status: 'In Progress' },
  { step: 'Step 02', title: 'CompTIA Network+',                 issuer: 'CompTIA',              icon: <Network className="w-5 h-5" />,   status: 'Planned'     },
  { step: 'Step 03', title: 'CompTIA Security+',                issuer: 'CompTIA',              icon: <Lock className="w-5 h-5" />,      status: 'Planned'     },
  { step: 'Step 04', title: 'Splunk Core Certified User',       issuer: 'Splunk',               icon: <BarChart2 className="w-5 h-5" />, status: 'Planned'     },
  { step: 'Step 05', title: 'Blue Team Labs / TryHackMe',       issuer: 'TryHackMe',            icon: <Terminal className="w-5 h-5" />,  status: 'Planned'     },
  { step: 'Step 06', title: 'CEH — Certified Ethical Hacker',   issuer: 'EC-Council',           icon: <Award className="w-5 h-5" />,     status: 'Planned'     },
];

export default function Certifications() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(certs.length).fill(false));
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleItems(prev => { const n = [...prev]; n[i] = true; return n; });
            }, i * 100);
            obs.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <>
      <style>{`
        .cert-card {
          transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease;
        }
        .cert-card.hidden-card  { opacity: 0; transform: translateY(32px); }
        .cert-card.visible-card { opacity: 1; transform: translateY(0);    }
        .cert-card.dimmed-card  { opacity: 0.25; }

        .cert-icon { transition: background-color 0.3s ease, color 0.3s ease; }
        .cert-status-dot { transition: background-color 0.3s ease, box-shadow 0.3s ease; }
        .cert-status-text { transition: color 0.3s ease; }

        @keyframes blink {
          0%,100% { opacity:1; } 50% { opacity:0.25; }
        }
        .pulsing { animation: blink 1.6s ease-in-out infinite; }
      `}</style>

      <section
        id="certifications"
        style={{ backgroundColor: '#000000', padding: '96px 0', position: 'relative', overflow: 'hidden' }}
      >
        {/* dot-grid bg */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(0,229,255,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 800, color: '#ffffff',
              letterSpacing: '-0.5px', marginBottom: '12px',
            }}>
              Certifications
            </h2>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: '15px',
              color: 'rgba(255,255,255,0.4)', maxWidth: '420px',
              margin: '0 auto', lineHeight: 1.7,
            }}>
              My SOC certification roadmap — ordered by learning path
            </p>
          </div>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}>
            {certs.map((cert, i) => {
              const isHovered    = hoveredIndex === i;
              const isDimmed     = hoveredIndex !== null && !isHovered;
              const isVisible    = visibleItems[i];
              const isInProgress = cert.status === 'In Progress';
              const isPlanned    = cert.status === 'Planned';

              // dot glows cyan when: always for In Progress, or hovered for Planned
              const dotActive = isInProgress || (isPlanned && isHovered);

              return (
                <div
                  key={i}
                  ref={el => { itemRefs.current[i] = el; }}
                  className={`cert-card ${isVisible ? 'visible-card' : 'hidden-card'} ${isDimmed ? 'dimmed-card' : ''}`}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    borderRadius: '14px',
                    padding: '20px 22px',
                    border: `1px solid ${isHovered ? 'rgba(0,229,255,0.55)' : 'rgba(255,255,255,0.07)'}`,
                    backgroundColor: isHovered ? 'rgba(0,229,255,0.05)' : 'rgba(255,255,255,0.025)',
                    boxShadow: isHovered
                      ? '0 0 28px 4px rgba(0,229,255,0.18), 0 0 55px 8px rgba(0,229,255,0.07)'
                      : 'none',
                    backdropFilter: 'blur(8px)',
                    cursor: 'default',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  {/* Icon */}
                  <div
                    className="cert-icon"
                    style={{
                      flexShrink: 0,
                      padding: '10px',
                      borderRadius: '10px',
                      backgroundColor: isHovered ? 'rgba(0,229,255,1)' : 'rgba(0,229,255,0.1)',
                      color: isHovered ? '#000' : 'rgba(0,229,255,1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {cert.icon}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: "'Inter', monospace",
                      fontSize: '9px', letterSpacing: '3px',
                      textTransform: 'uppercase',
                      color: 'rgba(0,229,255,0.45)',
                      marginBottom: '4px',
                    }}>
                      {cert.step}
                    </p>
                    <h3 style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: '0.92rem', fontWeight: 700,
                      color: '#ffffff', lineHeight: 1.3,
                      marginBottom: '3px',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {cert.title}
                    </h3>
                    <p style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.3)',
                      letterSpacing: '0.5px',
                    }}>
                      {cert.issuer}
                    </p>
                  </div>

                  {/* Status */}
                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                    <span
                      className={`cert-status-dot ${isInProgress ? 'pulsing' : ''}`}
                      style={{
                        width: 7, height: 7, borderRadius: '50%', display: 'inline-block',
                        backgroundColor: dotActive ? '#00e5ff' : 'rgba(255,255,255,0.15)',
                        boxShadow: dotActive ? '0 0 7px #00e5ff' : 'none',
                      }}
                    />
                    <span
                      className="cert-status-text"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '8px', letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        color: dotActive ? 'rgba(0,229,255,0.8)' : 'rgba(255,255,255,0.18)',
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                      }}
                    >
                      {cert.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom label */}
          <div style={{
            textAlign: 'center', marginTop: '48px',
            fontFamily: "'Inter', monospace",
            fontSize: '10px', letterSpacing: '3px',
            color: '#00e5ff', opacity: 0.18,
            textTransform: 'uppercase',
          }}>
            the roadmap continues
          </div>
        </div>
      </section>
    </>
  );
}