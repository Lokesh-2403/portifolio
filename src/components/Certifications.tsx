import { Award, Clock, CheckCircle } from 'lucide-react';

interface LearningItem {
  title: string;
  status: 'pursuing' | 'completed';
  items: string[];
}

export default function Certifications() {
  const learningPaths: LearningItem[] = [
    {
      title: 'Completed Learning',
      status: 'completed',
      items: [
        'Networking Fundamentals (Self-study)',
        'Linux Basics Training'
      ]
    },
    {
      title: 'Currently Pursuing',
      status: 'pursuing',
      items: [
        'Security+ (Planned)',
        'SOC Analyst Learning Path'
      ]
    }
  ];

  return (
    <section id="certifications" className="relative py-24 ">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-text-primary font-poppins mb-4 tracking-tight">
            Certifications & Learning
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Committed to continuous professional development in cybersecurity
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {learningPaths.map((path, index) => (
            <div
              key={index}
              className="bg-secondary-bg/50 backdrop-blur-sm rounded-xl p-8 border border-white/8 hover:border-accent-cyan/50 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${
                  path.status === 'pursuing'
                    ? 'bg-yellow-500/10 text-yellow-500'
                    : 'bg-accent-cyan/10 text-accent-cyan'
                }`}>
                  {path.status === 'pursuing' ? (
                    <Clock className="w-6 h-6" />
                  ) : (
                    <CheckCircle className="w-6 h-6" />
                  )}
                </div>
                <h3 className="text-2xl font-semibold text-text-primary font-poppins">
                  {path.title}
                </h3>
              </div>

              <ul className="space-y-4">
                {path.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex items-start gap-3 p-4 bg-primary-bg/50 rounded-lg border border-white/5 hover:border-accent-cyan/30 transition-all duration-300"
                  >
                    <Award className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" />
                    <span className="text-text-secondary text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-accent-cyan/10 border border-accent-cyan/20 rounded-xl px-6 py-4">
            <p className="text-text-secondary text-sm">
              <span className="text-accent-cyan font-semibold">Learning Path Focus:</span>{' '}
              Building towards SOC Analyst and Security Operations roles
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
