import React from "react";
import { Play, Shield, Award, Globe, Sparkles, Link } from "lucide-react";

const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-gray-900 to-blue-900/20"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full -translate-y-48 translate-x-48 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full translate-y-48 -translate-x-48 blur-3xl"></div>

      <div className="container relative mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-sm font-medium bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Trusted by 10,000+ developers
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="block">Learn Programming.</span>
            <span className="block bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Build Real Skills.
            </span>
            <span className="block">Create Your Future.</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            High-quality programming video courses designed for modern
            developers. Learn step-by-step, build real projects, and grow your
            career — all in one platform.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-6 mb-10">
            {[
              { icon: Shield, text: "One-time payment" },
              { icon: Globe, text: "INR pricing" },
              { icon: Award, text: "Lifetime access" },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 dark:bg-gray-800/50 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border dark:border-gray-700 border-gray-200"
              >
                <feature.icon className="w-5 h-5 text-green-400" />
                <span className="font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="group px-8 py-4 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:-translate-y-1 shadow-2xl hover:shadow-blue-500/30 flex items-center justify-center space-x-3">
              <Play className="w-5 h-5" />
              <span>Start Learning</span>
            </button>
            <a
              href={"#courses"}
              className="px-8 py-4 rounded-xl dark:bg-gray-800 bg-white border dark:border-gray-700 border-gray-200 dark:text-gray-300 text-gray-700 font-semibold text-lg hover:border-blue-500 hover:text-blue-500 transition-all"
            >
              Browse Courses
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {[
              { value: "50+", label: "Courses" },
              { value: "10K+", label: "Students" },
              { value: "500+", label: "Projects" },
              { value: "4.9", label: "Rating" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
