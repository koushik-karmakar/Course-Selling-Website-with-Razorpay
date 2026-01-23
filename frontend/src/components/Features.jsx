import React from "react";
import {
  Video,
  Code,
  Zap,
  Globe,
  Moon,
  Smartphone,
  BookOpen,
  Users,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Video,
      title: "High-quality Video Lessons",
      description:
        "Crystal clear 4K videos with professional editing and audio quality.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Code,
      title: "Project-based Learning",
      description: "Build real-world applications, not just follow tutorials.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Modern Tech Stack",
      description:
        "Learn technologies actually used in today's tech companies.",
      color: "from-orange-500 to-yellow-500",
    },
    {
      icon: Globe,
      title: "INR Pricing",
      description: "Affordable pricing in Indian Rupees with no hidden costs.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Moon,
      title: "Dark UI Theme",
      description:
        "Developer-friendly dark interface for comfortable learning.",
      color: "from-gray-500 to-slate-500",
    },
    {
      icon: Smartphone,
      title: "Fully Responsive",
      description: "Learn seamlessly across desktop, tablet, and mobile.",
      color: "from-red-500 to-rose-500",
    },
    {
      icon: BookOpen,
      title: "Structured Curriculum",
      description: "Step-by-step learning path from beginner to advanced.",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Join our community of 10,000+ developers for help.",
      color: "from-violet-500 to-purple-500",
    },
  ];

  return (
    <section id="features" className="py-20 dark:bg-gray-900/50 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-4">
            <span className="text-sm font-medium bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Built for Developers Who Want{" "}
            <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Real Results
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to transform from beginner to job-ready
            developer
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl dark:bg-gray-800/50 bg-white border dark:border-gray-700 border-gray-200 hover:border-transparent transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div
                className="absolute inset-0 rounded-2xl bg-linear-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(45deg, ${feature.color.split(" ")[0].replace("from-", "")}, ${feature.color.split(" ")[1].replace("to-", "")})`,
                }}
              ></div>

              <div className="relative z-10">
                <div
                  className={`w-14 h-14 rounded-xl bg-linear-to-r ${feature.color} p-3 mb-6 flex items-center justify-center`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold mb-3 dark:text-white text-gray-900">
                  {feature.title}
                </h3>

                <p className="dark:text-gray-400 text-gray-600">
                  {feature.description}
                </p>

                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-1 bg-linear-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
