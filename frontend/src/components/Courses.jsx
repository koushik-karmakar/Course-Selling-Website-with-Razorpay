import React from "react";
import { Play, Clock, Download, Award, Star, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Courses = () => {
  const navigate = useNavigate();
  const courses = [
    {
      title: "JavaScript Mastery",
      url: "javascript-mastery",
      description: "Master modern JavaScript from basics to advanced concepts",
      price: "₹1,999",
      originalPrice: "₹4,999",
      duration: "40 hours",
      projects: 12,
      rating: 4.9,
      students: 2450,
      tags: ["Beginner Friendly", "Project-based"],
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "React Pro",
      url: "react-pro",
      description: "Build modern web applications with React & Next.js",
      price: "₹2,499",
      originalPrice: "₹5,999",
      duration: "50 hours",
      projects: 15,
      rating: 4.8,
      students: 1890,
      tags: ["Advanced", "Hooks"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Full Stack Development",
      url: "full-stack-development",
      description: "Complete MERN stack development course",
      price: "₹3,999",
      originalPrice: "₹8,999",
      duration: "80 hours",
      projects: 20,
      rating: 4.9,
      students: 1560,
      tags: ["Complete Package", "Job-ready"],
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Node.js Backend",
      url: "nodejs-backend",
      description: "Build scalable backend APIs and microservices",
      price: "₹2,999",
      originalPrice: "₹6,499",
      duration: "45 hours",
      projects: 10,
      rating: 4.7,
      students: 2100,
      tags: ["Backend", "APIs"],
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Python for Data Science",
      url: "python-data-science",
      description: "Learn Python, Pandas, NumPy, and ML algorithms",
      price: "₹2,999",
      originalPrice: "₹6,999",
      duration: "55 hours",
      projects: 18,
      rating: 4.8,
      students: 3200,
      tags: ["Data Science", "ML"],
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Mobile App Development",
      url: "mobile-app-development",
      description: "Build iOS & Android apps with React Native",
      price: "₹3,499",
      originalPrice: "₹7,999",
      duration: "60 hours",
      projects: 14,
      rating: 4.7,
      students: 1780,
      tags: ["Cross-platform", "Mobile"],
      color: "from-purple-500 to-blue-500",
    },
    {
      title: "UI/UX Design",
      url: "ui-ux-design",
      description: "Master Figma, prototyping, and user-centered design",
      price: "₹2,299",
      originalPrice: "₹5,499",
      duration: "35 hours",
      projects: 8,
      rating: 4.9,
      students: 1950,
      tags: ["Design", "Figma"],
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "DevOps & Cloud",
      url: "devops-Cloud",
      description: "Docker, Kubernetes, AWS, and CI/CD pipeline",
      price: "₹4,499",
      originalPrice: "₹9,999",
      duration: "65 hours",
      projects: 12,
      rating: 4.8,
      students: 1250,
      tags: ["Cloud", "DevOps"],
      color: "from-orange-500 to-red-500",
    },
    {
      title: "TypeScript Pro",
      url: "typeScript",
      description: "Advanced TypeScript for scalable applications",
      price: "₹1,799",
      originalPrice: "₹4,299",
      duration: "30 hours",
      projects: 9,
      rating: 4.9,
      students: 2100,
      tags: ["Type Safety", "Advanced"],
      color: "from-blue-600 to-indigo-600",
    },
    {
      title: "GraphQL API Development",
      url: "graphql-api-development",
      description: "Build efficient APIs with GraphQL and Apollo",
      price: "₹2,199",
      originalPrice: "₹5,299",
      duration: "25 hours",
      projects: 7,
      rating: 4.6,
      students: 1450,
      tags: ["API", "GraphQL"],
      color: "from-pink-500 to-purple-500",
    },
    {
      title: "Web3 & Blockchain",
      url: "web3-blockchain",
      description: "Solidity, Smart Contracts, and DApp development",
      price: "₹5,999",
      originalPrice: "₹12,999",
      duration: "70 hours",
      projects: 15,
      rating: 4.7,
      students: 980,
      tags: ["Blockchain", "Web3"],
      color: "from-gray-700 to-gray-900",
    },
    {
      title: "System Design",
      url: "system-design",
      description: "Design scalable systems for interviews & real-world",
      price: "₹3,299",
      originalPrice: "₹7,499",
      duration: "40 hours",
      projects: 10,
      rating: 4.9,
      students: 2300,
      tags: ["Interview", "Scalability"],
      color: "from-teal-500 to-emerald-500",
    },
  ];

  return (
    <section id="courses" className="pt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-4">
            <span className="text-sm font-medium bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Our Courses
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Programming Courses Designed to Make You{" "}
            <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Job-Ready
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Each course is carefully structured from basics to advanced
            concepts, with practical examples and real-world projects.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {courses.map((course, index) => (
            <div
              key={index}
              className="group relative bg-linear-to-br dark:from-gray-800/50 dark:to-gray-900/50 from-white to-gray-50 rounded-2xl border dark:border-gray-700 border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`h-2 bg-linear-to-r ${course.color}`}></div>

              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs font-medium rounded-full dark:bg-gray-800 bg-gray-100 dark:text-gray-300 text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-bold mb-3 dark:text-white text-gray-900">
                  {course.title}
                </h3>
                <p className="dark:text-gray-400 text-gray-600 mb-6">
                  {course.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold dark:text-white text-gray-900">
                      {course.duration}
                    </div>
                    <div className="text-sm dark:text-gray-400 text-gray-600">
                      Content
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold dark:text-white text-gray-900">
                      {course.projects}+
                    </div>
                    <div className="text-sm dark:text-gray-400 text-gray-600">
                      Projects
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <span className="dark:text-gray-300 text-gray-700 font-medium">
                      {course.rating}
                    </span>
                  </div>
                  <span className="dark:text-gray-400 text-gray-600 text-sm">
                    {course.students.toLocaleString()} students
                  </span>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold dark:text-white text-gray-900">
                      {course.price}
                    </span>
                    <span className="line-through dark:text-gray-500 text-gray-400">
                      {course.originalPrice}
                    </span>
                    <span className="px-2 py-1 text-xs font-bold bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-full">
                      SAVE 60%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/course/${course.url}`)}
                  className="cursor-pointer w-full py-3 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all group-hover:shadow-lg group-hover:shadow-blue-500/25"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
