import { Download, FileText } from 'lucide-react';

export default function Resume() {
  return (
    <section id="resume" className="relative py-24 ">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-block p-4 bg-accent-cyan/10 rounded-2xl mb-6">
              <FileText className="w-12 h-12 text-accent-cyan" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-text-primary font-poppins mb-4 tracking-tight">
              Download Resume
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              View a detailed overview of my education, skills, and practical experience.
            </p>
          </div>

          <a
            href="#"
            className="inline-flex items-center gap-3 px-8 py-4 bg-accent-cyan text-primary-bg font-semibold rounded-lg transition-all duration-300 hover:shadow-xl hover:shadow-accent-cyan/50 hover:-translate-y-1 group"
          >
            <Download className="w-5 h-5 group-hover:animate-bounce" />
            <span>Download Resume PDF</span>
          </a>

          <p className="mt-8 text-text-secondary text-sm">
            Updated regularly with latest skills and certifications
          </p>
        </div>
      </div>
    </section>
  );
}
