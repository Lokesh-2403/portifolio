export default function About() {
  return (
    <section id="about" className="relative py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-text-primary font-poppins mb-4 tracking-tight">
              About Me
            </h2>
            <div className="relative h-px bg-gradient-to-r from-transparent via-accent-cyan to-transparent opacity-50 max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-cyan to-transparent blur-sm"></div>
            </div>
          </div>

          <div className="bg-primary-bg/50 backdrop-blur-sm rounded-2xl p-8 lg:p-12 border border-white/8 hover:border-accent-blue/30 transition-all duration-500">
            <p className="text-text-secondary text-lg leading-relaxed">
              I am a dedicated beginner cybersecurity analyst working towards building a strong foundation
              in defensive security practices. My focus lies in understanding network behavior, identifying
              vulnerabilities, and learning how security teams detect and respond to threats.
            </p>
            <p className="text-text-secondary text-lg leading-relaxed mt-6">
              Through hands-on lab environments and structured learning paths, I continuously improve my
              skills in networking fundamentals, system security, and basic threat analysis. My goal is to
              contribute to a Security Operations Center (SOC) environment and grow into a skilled security
              professional.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
