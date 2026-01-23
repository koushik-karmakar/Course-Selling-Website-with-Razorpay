import React from "react";
import {
  Code,
  Cpu,
  Database,
  Globe,
  Shield,
  Zap,
  Cloud,
  Smartphone,
} from "lucide-react";

const Technologies = () => {
  const technologies = [
    {
      name: "JavaScript (ES6+)",
      icon: Code,
      color: "from-yellow-500 to-yellow-600",
    },
    { name: "React.js", icon: Cpu, color: "from-cyan-500 to-blue-500" },
    {
      name: "Tailwind CSS",
      icon: Smartphone,
      color: "from-teal-500 to-emerald-500",
    },
    {
      name: "Node.js & Express",
      icon: Globe,
      color: "from-green-500 to-emerald-500",
    },
    { name: "MongoDB", icon: Database, color: "from-green-600 to-green-700" },
    { name: "REST APIs", icon: Cloud, color: "from-blue-500 to-indigo-500" },
    {
      name: "Authentication & Security",
      icon: Shield,
      color: "from-red-500 to-pink-500",
    },
    { name: "Deployment", icon: Zap, color: "from-purple-500 to-pink-500" },
  ];

  return (
    <section id="technologies" className="py-20 dark:bg-gray-900/50 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-4">
            <span className="text-sm font-medium bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Technologies
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Modern Tools.
            <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Industry-Ready Skills.
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Learn the technologies that power today's most successful tech
            companies
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl dark:bg-gray-800/50 bg-white border dark:border-gray-700 border-gray-200 hover:border-transparent transition-all duration-300 hover:scale-105"
            >
              <div className="text-center">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-linear-to-r ${tech.color} p-4 flex items-center justify-center`}
                >
                  <tech.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold dark:text-white text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                  {tech.name}
                </h3>
              </div>

              <div
                className="absolute inset-0 rounded-2xl bg-linear-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(45deg, ${tech.color.split(" ")[0].replace("from-", "")}, ${tech.color.split(" ")[1].replace("to-", "")})`,
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Technologies;
