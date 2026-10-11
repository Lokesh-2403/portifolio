
import { useEffect, useRef, useState } from 'react';
import { Lock, ShieldCheck, Terminal } from 'lucide-react';

const certs = [
  {
    title: 'CompTIA Security+',
    issuer: 'CompTIA',
    icon: <Lock className="w-5 h-5" />,
  },
  {
    title: 'Microsoft SC-200',
    issuer: 'Microsoft',
    icon: <ShieldCheck className="w-5 h-5" />,
  },
  {
    title: 'BTL1',
    issuer: 'Security Blue Team',
    icon: <Terminal className="w-5 h-5" />,
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
                const next = [...prev];
                next[i] = true;
                return next;
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

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  return (
    <>
      <style>{`
        
.cert-card {
  transition:
    opacity 0.4s ease,
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.3s ease,
    border-color 0.3s ease,
    background-color 0.3s ease;
}

.cert-card.visible-card {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.cert-card.visible-card:hover {
  transform: translateY(-4px) scale(1.05);
  z-index: 2;
}

.cert-card.hidden-card {
  opacity: 0;
  transform: translateY(32px) scale(0.96);
}

.cert-card.dimmed-card {
  opacity: 0.55;
}

@media (prefers-reduced-motion: reduce) {
  .cert-card,
  .cert-icon {
    transition: none !important;
  }
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
      marginBottom: '16px',
    }}
  >
    Certifications
  </h2>

  <p
    style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
      lineHeight: 1.8,
      color: '#c7b8a6',
      maxWidth: '680px',
      margin: '0 auto',
      padding: '0 8px',
    }}
  >
    Building a strong foundation in cybersecurity through continuous learning,
    hands-on practice, and industry-recognized certifications in security
    operations, threat detection, and defense.
  </p>
</div>

          {/* Certification cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {certs.map((cert, i) => {
              const isHovered = hoveredIndex === i;
              const isDimmed = hoveredIndex !== null && !isHovered;
              const isVisible = visibleItems[i];

              return (
                <div
                  key={cert.title}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className={`cert-card ${
                    isVisible ? 'visible-card' : 'hidden-card'
                  } ${isDimmed ? 'dimmed-card' : ''}`}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onFocus={() => setHoveredIndex(i)}
                  onBlur={() => setHoveredIndex(null)}
                  style={{
                    borderRadius: '18px',
                    padding: '24px 22px',
                    border: `1px solid ${
                      isHovered
                        ? '#b46a55'
                        : 'rgba(180,106,85,0.3)'
                    }`,
                    backgroundColor: isHovered
                      ? '#f2efe8'
                      : 'rgba(242,239,232,0.97)',
                    boxShadow: isHovered
                      ? '0 16px 36px rgba(180,106,85,0.18)'
                      : '0 6px 20px rgba(0,0,0,0.16)',
                    cursor: 'default',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    minWidth: 0,
                  }}
                >
                  {/* Icon */}
                  <div
                    className="cert-icon"
                    style={{
                      flexShrink: 0,
                      padding: '12px',
                      borderRadius: '12px',
                      backgroundColor: isHovered
                        ? '#1f2a44'
                        : '#c7b8a6',
                      color: isHovered ? '#f2efe8' : '#0b1320',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                    }}
                  >
                    {cert.icon}
                  </div>

                  {/* Certification details */}
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '1.045rem',
                        fontWeight: 700,
                        color: '#0b1320',
                        lineHeight: 1.4,
                        marginBottom: '4px',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {cert.title}
                    </h3>

                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '13.2px',
                        color: '#1f2a44',
                        opacity: 0.85,
                        letterSpacing: '0.2px',
                      }}
                    >
                      {cert.issuer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
