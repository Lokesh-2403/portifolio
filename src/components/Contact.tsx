import { Mail, Github, Linkedin } from "lucide-react";

export default function Contact() {
  const contactLinks = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      href: "mailto:adusumalli3818@gmail.com",
      color: "text-green-400",
      bg: "bg-green-400/10",
      hoverBg: "hover:bg-green-400/20",
      glow: "hover:shadow-green-400/30",
    },
    {
      icon: <Github className="w-5 h-5" />,
      label: "GitHub",
      href: "https://github.com/Lokesh-2403",
      color: "text-gray-300",
      bg: "bg-gray-400/10",
      hoverBg: "hover:bg-gray-400/20",
      glow: "hover:shadow-gray-400/30",
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/lokesh-adusumalli-38646b329",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      hoverBg: "hover:bg-blue-500/20",
      glow: "hover:shadow-blue-500/30",
    },
  ];

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-text-primary font-poppins tracking-tight">
            Contact
          </h2>

          <div className="mt-24 flex justify-center gap-14 flex-wrap">
            {contactLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target={link.label === "Email" ? "_self" : "_blank"}
                rel="noopener noreferrer"
                className={`group flex items-center gap-4 
                  bg-primary-bg/70 backdrop-blur-sm 
                  rounded-2xl px-8 py-4 
                  border border-white/10 
                  transition-all duration-300 
                  hover:-translate-y-1 
                  hover:shadow-xl ${link.glow} ${link.hoverBg}`}
              >
                <div
                  className={`p-3 rounded-xl ${link.bg} ${link.color} transition-all duration-300`}
                >
                  {link.icon}
                </div>

                <span className="text-text-primary text-lg font-medium">
                  {link.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
