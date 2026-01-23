import React from "react";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Frontend Developer at Google",
      avatar: "RK",
      content:
        "The JavaScript Mastery course transformed my career. The project-based approach helped me land my dream job at Google. Highly recommended!",
      rating: 5,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Priya Sharma",
      role: "Full Stack Developer",
      avatar: "PS",
      content:
        "As a beginner, I was overwhelmed by programming. This platform made learning accessible and fun. The dark UI is perfect for long coding sessions.",
      rating: 5,
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Amit Patel",
      role: "Freelance Developer",
      avatar: "AP",
      content:
        "The real-world projects are exactly what I needed. I went from zero to building production-ready applications in just 3 months.",
      rating: 4,
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Sneha Reddy",
      role: "React Developer",
      avatar: "SR",
      content:
        "Clear explanation, practical approach, and clean content. The course structure helped me learn efficiently while working full-time.",
      rating: 5,
      color: "from-orange-500 to-yellow-500",
    },
  ];

  return (
    <section id="testimonials" className="py-20 dark:bg-gray-900/50 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-4">
            <span className="text-sm font-medium bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Testimonials
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What Our{" "}
            <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Learners Say
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl dark:bg-gray-800/50 bg-white border dark:border-gray-700 border-gray-200 hover:border-transparent transition-all duration-300 hover:-translate-y-2"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 dark:text-gray-700 text-gray-200 group-hover:text-blue-500/20 transition-colors" />

              <div className="flex items-center mb-6">
                <div
                  className={`w-14 h-14 rounded-full bg-linear-to-r ${testimonial.color} flex items-center justify-center mr-4`}
                >
                  <span className="text-white font-bold text-lg">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-bold dark:text-white text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="dark:text-gray-400 text-gray-600">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <p className="dark:text-gray-300 text-gray-700 mb-6 italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating
                        ? "text-yellow-400 fill-current"
                        : "dark:text-gray-700 text-gray-200"
                    }`}
                  />
                ))}
                <span className="ml-2 dark:text-gray-400 text-gray-600">
                  {testimonial.rating}/5
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
