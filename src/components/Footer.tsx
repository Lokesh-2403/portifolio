
export default function Footer() {
  return (
    <footer
      className="relative py-8 border-t border-[#c7b8a6]/10"
      style={{ backgroundColor: "#0b1320" }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center">
          <p className="text-text-primary font-semibold mb-1">
            Lokesh Babu
          </p>

          <p className="text-text-secondary text-sm mb-4">
            Beginner Cybersecurity Analyst
          </p>

          <p className="text-text-secondary text-xs">
            © 2026 All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
