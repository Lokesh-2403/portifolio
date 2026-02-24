import { ExternalLink, Github } from "lucide-react";

interface Project {
  title: string;
  description: string;
  tags: string[];
  status: "Planned" | "Underway" | "Completed";
  githubLink?: string;
}

interface ProjectsProps {
  onViewHostProject: () => void;
}

export default function Projects({ onViewHostProject }: ProjectsProps) {
  const projects: Project[] = [
    {
      title: "Host-Based Network Reconnaissance & Service Enumeration",
      status: "Completed",
      description:
        "A practical host-based reconnaissance lab where Nmap is used to discover live hosts, identify open ports, enumerate running services, and perform OS fingerprinting within a controlled cybersecurity environment.",
      tags: [
        "Kali Linux",
        "Nmap",
        "TCP SYN Scan",
        "Service Enumeration",
        "OS Detection",
      ],
      githubLink: "https://github.com/Lokesh-2403/host-based-reconnaissance", // Updated link
    },
    {
      title: "Endpoint Security Monitoring",
      status: "Underway",
      description:
        "Implement endpoint monitoring and threat detection mechanisms to identify suspicious processes and privilege escalation attempts.",
      tags: [
        "Kali Linux",
        "Wazuh / OSSEC",
        "Auditd",
        "Syslog",
        "Process Monitoring",
      ],
      githubLink: "https://github.com/Lokesh-2403/endpoint-security",
    },
    {
      title: "Linux SSH Brute Force Detection System",
      status: "Planned",
      description:
        "Detect and analyze SSH brute-force attempts on a Linux server by monitoring authentication logs and extracting suspicious IP activity patterns.",
      tags: ["Kali Linux", "Bash", "Python", "Regex", "Linux Auth Logs"],
      githubLink: "https://github.com/Lokesh-2403/ssh-brute-force",
    },
    {
      title: "Windows Failed Login Investigation Tool",
      status: "Planned",
      description:
        "Analyze Windows Security Event Logs to detect repeated failed login attempts and identify potential brute-force activity.",
      tags: [
        "Windows VM",
        "PowerShell",
        "Event Viewer",
        "Security Event Logs (4625)",
      ],
      githubLink: "https://github.com/Lokesh-2403/windows-login",
    },
  ];

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/10 text-green-400 border border-green-500/30 shadow-md shadow-green-500/20";
      case "Underway":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-md shadow-blue-500/20";
      case "Planned":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 shadow-md shadow-yellow-500/20";
      default:
        return "";
    }
  };

  const getDotClasses = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-400";
      case "Underway":
        return "bg-blue-400 animate-pulse";
      case "Planned":
        return "bg-yellow-400";
      default:
        return "";
    }
  };

  return (
    <section id="projects" className="py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-text-primary font-poppins mb-4 tracking-tight">
            Security Projects
          </h2>
          <p className="text-gray-400 text-center mt-4 max-w-2xl mx-auto">
            All projects are built in a controlled lab environment for defensive security learning purposes.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group bg-primary-bg/60 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-accent-cyan/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent-cyan/20"
            >
              <h3 className="text-2xl font-semibold text-text-primary font-poppins mb-2 group-hover:text-accent-cyan transition-colors duration-300">
                {project.title}
              </h3>

              <span
                className={`inline-flex items-center gap-2 mb-4 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase rounded-full ${getStatusClasses(
                  project.status
                )}`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${getDotClasses(
                    project.status
                  )}`}
                ></span>
                {project.status}
              </span>

              <p className="text-text-secondary text-base leading-relaxed mb-6">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-3 py-1 bg-accent-cyan/10 text-accent-cyan text-sm rounded-full border border-accent-cyan/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                {/* 🔥 Special logic for first project */}
                {index === 0 ? (
                  <button
                    onClick={onViewHostProject}
                    className="flex items-center gap-2 px-4 py-2 bg-accent-cyan/10 text-accent-cyan rounded-lg border border-accent-cyan/20 hover:bg-accent-cyan hover:text-primary-bg transition-all duration-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm font-medium">View Details</span>
                  </button>
                ) : (
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-accent-cyan/10 text-accent-cyan rounded-lg border border-accent-cyan/20 opacity-50 cursor-not-allowed"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm font-medium">View Details</span>
                  </button>
                )}

                {/* GitHub */}
                <a
                  href={project.githubLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-transparent text-text-secondary rounded-lg border border-white/10 hover:border-accent-cyan hover:text-accent-cyan transition-all duration-300"
                >
                  <Github className="w-4 h-4" />
                  <span className="text-sm font-medium">GitHub</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}