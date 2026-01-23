import React from "react";
import {
  Search,
  CreditCard,
  PlayCircle,
  Code,
  Trophy,
  Users,
} from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Choose Your Course",
      description:
        "Browse our catalog and select the perfect course for your goals",
      color: "from-blue-500 to-cyan-500",
    },
    {
      number: "02",
      icon: CreditCard,
      title: "Secure Payment",
      description: "Pay once in INR and get lifetime access to the course",
      color: "from-purple-500 to-pink-500",
    },
    {
      number: "03",
      icon: PlayCircle,
      title: "Start Learning",
      description: "Access high-quality video lessons anytime, anywhere",
      color: "from-orange-500 to-yellow-500",
    },
    {
      number: "04",
      icon: Code,
      title: "Build Projects",
      description: "Apply your knowledge by building real-world applications",
      color: "from-green-500 to-emerald-500",
    },
    {
      number: "05",
      icon: Users,
      title: "Join Community",
      description:
        "Get help from instructors and peers in our developer community",
      color: "from-indigo-500 to-blue-500",
    },
    {
      number: "06",
      icon: Trophy,
      title: "Get Certified",
      description: "Receive a certificate to showcase your new skills",
      color: "from-red-500 to-rose-500",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-4">
            <span className="text-sm font-medium bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              How It Works
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Simple.
            <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Clear.
            </span>
            Effective.
          </h2>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 dark:bg-gray-800 bg-gray-200 transform -translate-y-1/2"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="group p-6 rounded-2xl dark:bg-gray-800/50 bg-white border dark:border-gray-700 border-gray-200 hover:border-transparent transition-all duration-300 hover:scale-105 text-center">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div
                      className={`w-12 h-12 rounded-full bg-linear-to-r ${step.color} flex items-center justify-center`}
                    >
                      <span className="text-white font-bold">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-16 h-16 mx-auto mt-8 mb-6 rounded-xl bg-linear-to-r ${step.color} p-4 flex items-center justify-center`}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold mb-3 dark:text-white text-gray-900">
                    {step.title}
                  </h3>
                  <p className="dark:text-gray-400 text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
