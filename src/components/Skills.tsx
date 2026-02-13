import { Shield, Wrench, GraduationCap } from 'lucide-react';

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: string[];
}

export default function Skills() {
  const skillCategories: SkillCategory[] = [
    {
      title: 'Security Fundamentals',
      icon: <Shield className="w-6 h-6" />,
      skills: [
        'Networking Basics (TCP/IP, DNS, HTTP/HTTPS)',
        'OSI Model Understanding',
        'Linux Fundamentals',
        'Windows Basics',
        'Basic Threat Detection Concepts'
      ]
    },
    {
      title: 'Tools & Platforms',
      icon: <Wrench className="w-6 h-6" />,
      skills: [
        'Nmap',
        'Wireshark',
        'Burp Suite (Beginner Level)',
        'VirtualBox',
        'Kali Linux',
        'Git & GitHub'
      ]
    },
    {
      title: 'Currently Learning',
      icon: <GraduationCap className="w-6 h-6" />,
      skills: [
        'SIEM Fundamentals',
        'Log Analysis',
        'SOC Operations Basics',
        'Incident Response Fundamentals'
      ]
    }
  ];

  return (
    <section id="skills" className="relative py-24 ">
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
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="group bg-secondary-bg/50 backdrop-blur-sm rounded-xl p-8 border border-white/8 hover:border-accent-cyan/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-accent-cyan/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-accent-cyan/10 rounded-lg text-accent-cyan group-hover:bg-accent-cyan group-hover:text-primary-bg transition-all duration-300">
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
                    className="flex items-start gap-3 text-text-secondary hover:text-text-primary transition-colors duration-200"
                  >
                    <span className="text-accent-cyan mt-1.5 text-xs">▹</span>
                    <span className="text-base leading-relaxed">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
