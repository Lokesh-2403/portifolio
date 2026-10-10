
import { useEffect, useRef, useState } from 'react';
import { Lock, ShieldCheck, Terminal } from 'lucide-react';

const certs = [
  {
    step: 'Step 01',
    title: 'CompTIA Security+',
    issuer: 'CompTIA',
    icon: <Lock className="w-5 h-5" />,
    status: 'Planned',
  },
  {
    step: 'Step 02',
    title: 'Microsoft SC-200',
    issuer: 'Microsoft',
    icon: <ShieldCheck className="w-5 h-5" />,
    status: 'Planned',
  },
  {
    step: 'Step 03',
    title: 'BTL1',
    issuer: 'Security Blue Team',
    icon: <Terminal className="w-5 h-5" />,
    status: 'Planned',
  },
];

export default function Certifications() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(certs.length).fill(false)
  );
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    itemRefs.current.forEach((el, i) => {
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleItems((prev) => {
                const n = [...prev];
                n[i] = true;
                return n;
              });
            }, i * 100);

            obs.disconnect();
          }
        },
        { threshold: 0.2 }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <>
      <style>{`
        .cert-card {
          transition:
            opacity 0.4s ease,
            transform 0.5s cubic-bezier(0.22,1,0.36,1),
            box-shadow 0.3s ease,
            border-color 0.3s ease,
            background-color 0.3s ease;
        }

        .cert-card.hidden-card {
          opacity: 0;
          transform: translateY(32px);
        }

        .cert-card.visible-card {
          opacity: 1;
          transform: translateY(0);
        }

        /* Softer dimming of surrounding cards */
        .cert-card.dimmed-card {
          opacity: 0.65;
        }

        .cert-icon {
          transition:
            background-color 0.3s ease,
            color 0.3s ease;
        }

        .cert-status-dot {
          transition:
            background-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        .cert-status-text {
          transition: color 0.3s ease;
        }

        @keyframes blink {
          0%,100% {
            opacity: 1;
          }

          50% {
            opacity: 0.25;
          }
        }

        .pulsing {
          animation: blink 1.6s ease-in-out infinite;
        }
      `}</style>

      <section
        id="certifications"
        style={{
          backgroundColor: '#0b1320',
          padding: '96px 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Dot-grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage:
              'radial-gradient(circle, rgba(180,106,85,0.08) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '0 24px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Header */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: '64px',
            }}
          >
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 800,
                color: '#f2efe8',
                letterSpacing: '-0.5px',
                marginBottom: '12px',
              }}
            >
              Certifications
            </h2>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '15px',
                color: 'rgba(199,184,166,0.7)',
                maxWidth: '420px',
                margin: '0 auto',
                lineHeight: 1.7,
              }}
            >
              My SOC certification roadmap — ordered by learning path
            </p>
          </div>

          {/* Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {certs.map((cert, i) => {
              const isHovered = hoveredIndex === i;
              const isDimmed =
                hoveredIndex !== null && !isHovered;
              const isVisible = visibleItems[i];
              const isInProgress = cert.status === 'In Progress';
              const isPlanned = cert.status === 'Planned';

              const dotActive =
                isInProgress || (isPlanned && isHovered);

              return (
                <div
                  key={i}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className={`cert-card ${
                    isVisible
                      ? 'visible-card'
                      : 'hidden-card'
                  } ${isDimmed ? 'dimmed-card' : ''}`}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    borderRadius: '14px',
                    padding: '20px 22px',

                    /* Softer hover border */
                    border: `1px solid ${
                      isHovered
                        ? 'rgba(180,106,85,0.38)'
                        : 'rgba(199,184,166,0.07)'
                    }`,

                    /* Softer hover background */
                    backgroundColor: isHovered
                      ? 'rgba(180,106,85,0.035)'
                      : 'rgba(242,239,232,0.025)',

                    /* Softer hover glow */
                    boxShadow: isHovered
                      ? '0 0 20px 2px rgba(180,106,85,0.10), 0 0 38px 4px rgba(180,106,85,0.035)'
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

                      /* Softer icon highlight */
                      backgroundColor: isHovered
                        ? 'rgba(180,106,85,0.75)'
                        : 'rgba(180,106,85,0.1)',

                      color: isHovered
                        ? '#0b1320'
                        : '#b46a55',

                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {cert.icon}
                  </div>

                  {/* Text */}
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Inter', monospace",
                        fontSize: '9px',
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        color: 'rgba(180,106,85,0.8)',
                        marginBottom: '4px',
                      }}
                    >
                      {cert.step}
                    </p>

                    <h3
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        color: '#f2efe8',
                        lineHeight: 1.3,
                        marginBottom: '3px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {cert.title}
                    </h3>

                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '11px',
                        color: 'rgba(199,184,166,0.6)',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {cert.issuer}
                    </p>
                  </div>

                  {/* Status */}
                  <div
                    style={{
                      flexShrink: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <span
                      className={`cert-status-dot ${
                        isInProgress ? 'pulsing' : ''
                      }`}
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        display: 'inline-block',
                        backgroundColor: dotActive
                          ? '#b46a55'
                          : 'rgba(199,184,166,0.2)',
                        boxShadow: dotActive
                          ? '0 0 7px #b46a55'
                          : 'none',
                      }}
                    />

                    <span
                      className="cert-status-text"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '8px',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        color: dotActive
                          ? 'rgba(180,106,85,0.9)'
                          : 'rgba(199,184,166,0.35)',
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
          <div
            style={{
              textAlign: 'center',
              marginTop: '48px',
              fontFamily: "'Inter', monospace",
              fontSize: '10px',
              letterSpacing: '3px',
              color: '#c7b8a6',
              opacity: 0.35,
              textTransform: 'uppercase',
            }}
          >
            the roadmap continues
          </div>
        </div>
      </section>
    </>
  );
}
