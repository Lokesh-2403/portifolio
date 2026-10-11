
import { Linkedin } from "lucide-react";
import { siWhatsapp, siGithub } from "simple-icons";

function GmailLogo() {
  return (
    <img
      src="/gmail-logo.png"
      alt="Gmail"
      className="h-8 w-8 shrink-0 object-contain"
    />
  );
}

function BrandLogo({
  path,
  label,
}: {
  path: string;
  label: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8"
      role="img"
      aria-label={label}
    >
      <path d={path} fill="currentColor" />
    </svg>
  );
}



function WhatsAppLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8 text-[#25D366] transition-colors duration-300 group-hover:text-white"
      role="img"
      aria-label="WhatsApp"
    >
      <path
        d={siWhatsapp.path}
        fill="currentColor"
      />
    </svg>
  );
}



export default function Contact() {
  const contactLinks = [
    {
      icon: <GmailLogo />,
      label: "Email",
      href: "mailto:adusumalli3818@gmail.com",
      cardStyle: "bg-white text-[#D93025] border-white",
      hoverStyle:
        "hover:bg-[#D93025] hover:text-white hover:border-[#D93025]",
    },
    {
      icon: <BrandLogo path={siGithub.path} label="GitHub" />,
      label: "GitHub",
      href: "https://github.com/Lokesh-2403",
      cardStyle: "bg-white text-black border-gray-200",
      hoverStyle:
        "hover:bg-[#24292e] hover:text-white hover:border-[#24292e]",
    },
    {
      icon: (
        <Linkedin className="h-8 w-8 fill-[#0A66C2] text-[#0A66C2] transition-colors duration-300 group-hover:!fill-white group-hover:!text-white" />
      ),
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/lokeshbabuadusumalli/",
      cardStyle: "bg-white text-gray-900 border-white",
      hoverStyle:
        "hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]",
    },
    {
      icon: <WhatsAppLogo />,
      label: "WhatsApp",
      href: "https://wa.me/919492817919",
      cardStyle: "bg-white text-gray-900 border-white",
      hoverStyle:
        "hover:bg-[#25D366] hover:text-white hover:border-[#25D366]",
    },
  ];

  return (
    <section id="contact" className="bg-[#0b1320] py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-poppins text-4xl font-bold tracking-tight text-[#f2efe8] lg:text-5xl">
            Contact
          </h2>

          <div className="mt-16 px-2 pb-8 pt-5">
            <div className="overflow-x-auto py-3">
              <div className="flex w-max min-w-full flex-nowrap items-center justify-center gap-3 px-3 sm:gap-5 lg:gap-6">
                {contactLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.label === "Email" ? "_self" : "_blank"}
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className={`group flex shrink-0 items-center gap-3 rounded-2xl border px-5 py-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b46a55] sm:px-6 ${link.cardStyle} ${link.hoverStyle}`}
                  >
                    <span className="flex h-12 w-10 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      {link.icon}
                    </span>

                    <span className="whitespace-nowrap text-sm font-semibold sm:text-base">
                      {link.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
