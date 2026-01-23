import React from "react";
import {
  Code2,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Github,
  Linkedin,
  Instagram,
} from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Company: ["About Us", "Careers", "Press", "Blog"],
    Courses: ["All Courses", "JavaScript", "React", "Node.js", "Full Stack"],
    Support: ["Help Center", "Contact Us", "FAQ", "Community"],
    Legal: [
      "Privacy Policy",
      "Terms & Conditions",
      "Cookie Policy",
      "Refund Policy",
    ],
  };

  return (
    <footer
      id="contact"
      className="dark:bg-gray-900 bg-gray-900 text-gray-400 border-t dark:border-gray-800 border-gray-800"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12 mb-12">
          <div className="lg:w-1/3 xl:w-2/5">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">CodeMaster</span>
            </div>
            <p className="mb-6 text-gray-400">
              High-quality programming video courses designed for modern
              developers. Learn step-by-step, build real projects, and grow your
              career.
            </p>

            <div className="flex space-x-4">
              {[Twitter, Github, Linkedin, Instagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-linear-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:w-2/3 xl:w-3/5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category}>
                  <h3 className="text-white font-semibold mb-4">{category}</h3>
                  <ul className="space-y-2.5">
                    {links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-white transition-colors duration-200 hover:pl-1"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-blue-400" />
            <span>contact@codemaster.com</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-blue-400" />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-blue-400" />
            <span>Kolkata, India</span>
          </div>
        </div>

        <div className="border-t border-gray-800 my-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="mb-4 md:mb-0">
            © 2026 CodeMaster. Built for Developers.
          </p>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <span className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>One-time payment</span>
            </span>
            <span className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>INR pricing</span>
            </span>
            <span className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Lifetime access</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
