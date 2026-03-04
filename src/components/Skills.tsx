import { Shield, Wrench, GraduationCap, Network, Eye, FileSearch } from 'lucide-react';
import { useState } from 'react';

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: string[];
}

export default function Skills() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const skillCategories: SkillCategory[] = [
    {
      title: 'Security Fundamentals',
      icon: <Shield className="w-6 h-6" />,
      skills: [
        'Networking Basics (TCP/IP, DNS, HTTP/HTTPS)',
        'OSI Model Understanding',
        'Linux Fundamentals',
        'Windows Basics',
        'Basic Threat Detection Concepts',
        'CIA Triad & Security Principles',
        'Firewall & IDS/IPS Concepts'
      ]
    },
    {
      title: 'Networking & Infrastructure',
      icon: <Network className="w-6 h-6" />,
      skills: [
        'Subnetting & CIDR Notation',
        'VPN & Proxy Concepts',
        'DNS & DHCP Analysis',
        'Packet Capture & Analysis',
        'Network Traffic Baseline',
        'Port & Protocol Knowledge',
        'Active Directory Basics'
      ]
    },
    {
      title: 'SOC Tools & Platforms',
      icon: <Wrench className="w-6 h-6" />,
      skills: [
        'Splunk (SIEM)',
        'Wireshark',
        'Nmap & Nessus',
        'Burp Suite (Beginner)',
        'Kali Linux',
        'VirtualBox / VMware',
        'Git & GitHub'
      ]
    },
    {
      title: 'Threat Detection & Analysis',
      icon: <Eye className="w-6 h-6" />,
      skills: [
        'MITRE ATT&CK Framework',
        'IOC Identification',
        'Malware Behaviour Analysis',
        'Phishing Email Analysis',
        'Alert Triage & Prioritization',
        'False Positive Reduction',
        'Threat Intelligence Basics'
      ]
    },
    {
      title: 'Incident Response',
      icon: <FileSearch className="w-6 h-6" />,
      skills: [
        'Incident Response Lifecycle',
        'Log Collection & Correlation',
        'Evidence Preservation',
        'Containment & Eradication',
        'Post-Incident Reporting',
        'Ticketing & Documentation',
        'Chain of Custody Concepts'
      ]
    },
    {
      title: 'Currently Learning',
      icon: <GraduationCap className="w-6 h-6" />,
      skills: [
        'SIEM Rule Writing',
        'Endpoint Detection & Response (EDR)',
        'Cloud Security Monitoring (AWS)',
        'SOC Automation & SOAR',
        'CTF Challenges',
        'CompTIA Security+ Prep',
        'Python for Security Scripting'
      ]
    }
  ];

  return (
    <section id="skills" className="relative py-24" style={{ backgroundColor: '#000000' }}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-text-primary font-poppins mb-4 tracking-tight">
            Technical Skills
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Building a strong foundation in cybersecurity through continuous learning and practical application
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {skillCategories.map((category, index) => {
            const isHovered = hoveredIndex === index;
            const isDimmed = hoveredIndex !== null && !isHovered;

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="backdrop-blur-sm rounded-xl p-8 border"
                style={{
                  backgroundColor: isHovered
                    ? 'rgba(0, 200, 200, 0.06)'
                    : 'rgba(255,255,255,0.03)',
                  borderColor: isHovered
                    ? 'rgba(0, 210, 210, 0.6)'
                    : 'rgba(255,255,255,0.08)',
                  boxShadow: isHovered
                    ? '0 0 30px 6px rgba(0, 210, 210, 0.2), 0 0 60px 10px rgba(0, 210, 210, 0.08)'
                    : 'none',
                  opacity: isDimmed ? 0.35 : 1,
                  transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                  transition: 'all 0.3s ease',
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: isHovered ? 'rgba(0, 210, 210, 1)' : 'rgba(0, 210, 210, 0.1)',
                      color: isHovered ? '#000' : 'rgba(0, 210, 210, 1)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary font-poppins">
                    {category.title}
                  </h3>
                </div>

                <ul className="space-y-3">
                  {category.skills.map((skill, skillIndex) => (
                    <li
                      key={skillIndex}
                      className="flex items-start gap-3"
                      style={{
                        color: isHovered ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
                        transition: 'color 0.3s ease',
                      }}
                    >
                      <span className="mt-1.5 text-xs flex-shrink-0" style={{ color: 'rgba(0, 210, 210, 1)' }}>▹</span>
                      <span className="text-base leading-relaxed">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}