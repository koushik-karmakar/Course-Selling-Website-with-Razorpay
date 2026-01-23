import React from "react";
import { Sparkles, Shield, Lock, Award, Clock } from "lucide-react";

const CTA = () => {
  const benefits = [
    { icon: Shield, text: "Secure and trusted payments" },
    { icon: Lock, text: "Transparent pricing" },
    { icon: Award, text: "No subscriptions" },
    { icon: Clock, text: "Lifetime access" },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-gray-900 via-gray-900 to-blue-900/30 border border-gray-800 p-8 md:p-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full translate-y-32 -translate-x-32 blur-3xl"></div>

          <div className="relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-6">
                <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-sm font-medium bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Start Your Journey Today
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Start Learning Today.{" "}
                <span className="bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Build Skills That Matter.
                </span>
              </h2>

              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
                Upgrade your programming knowledge with high-quality video
                courses and real-world projects. Join 10,000+ developers who
                have transformed their careers with us.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 p-3 mb-4 flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="font-medium dark:text-gray-300 text-gray-700">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="cursor-pointer group px-8 py-4 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:-translate-y-1 shadow-2xl hover:shadow-blue-500/30 flex items-center justify-center space-x-3">
                <Sparkles className="w-5 h-5" />
                <span>Start Learning Now</span>
              </button>

              <a
                href={"#courses"}
                className="cursor-pointer px-8 py-4 rounded-xl dark:bg-gray-800/50 bg-white/50 backdrop-blur-sm border dark:border-gray-700 border-gray-300 dark:text-gray-300 text-gray-700 font-semibold text-lg hover:border-blue-500 hover:text-blue-500 transition-all"
              >
                Browse All Courses
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
