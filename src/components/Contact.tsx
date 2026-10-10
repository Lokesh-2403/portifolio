
import { Mail, Github, Linkedin } from "lucide-react";

export default function Contact() {
  const contactLinks = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      href: "mailto:adusumalli3818@gmail.com",
      color: "text-[#b46a55]",
      bg: "bg-[#b46a55]/10",
      hoverBg: "hover:bg-[#b46a55]/20",
      glow: "hover:shadow-[#b46a55]/30",
    },
    {
      icon: <Github className="w-5 h-5" />,
      label: "GitHub",
      href: "https://github.com/Lokesh-2403",
      color: "text-[#c7b8a6]",
      bg: "bg-[#c7b8a6]/10",
      hoverBg: "hover:bg-[#c7b8a6]/20",
      glow: "hover:shadow-[#c7b8a6]/30",
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/lokeshbabuadusumalli/",
      color: "text-[#b46a55]",
      bg: "bg-[#b46a55]/10",
      hoverBg: "hover:bg-[#b46a55]/20",
      glow: "hover:shadow-[#b46a55]/30",
    },
  ];

  return (
    <section
      id="contact"
      className="py-24"
      style={{ backgroundColor: "#0b1320" }}
    >
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
                  backdrop-blur-sm 
                  rounded-2xl px-8 py-4 
                  border border-[#c7b8a6]/10 
                  transition-all duration-300 
                  hover:-translate-y-1 
                  hover:shadow-xl ${link.glow} ${link.hoverBg}`}
                style={{ backgroundColor: "rgba(242,239,232,0.03)" }}
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
