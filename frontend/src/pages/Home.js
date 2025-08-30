// frontend/src/pages/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Home() {
  const navigate = useNavigate();

  const requireLogin = (callback) => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      callback();
    } else {
      toast.warning("⚠️ Please login first to access this feature.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white text-center">
          <h1 className="text-5xl font-bold mb-4 animate-fade-in">
            📚 AI Study Planner
          </h1>
          <p className="text-xl opacity-90 mb-6">
            Your personalized learning companion powered by AI
          </p>
          <div className="w-20 h-1 bg-white bg-opacity-50 mx-auto mb-8 rounded-full"></div>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-12">
          <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto leading-relaxed">
            Welcome to your smart study hub! Get personalized recommendations, track your progress, 
            and discover the perfect resources to achieve your learning goals.
          </p>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Card 1 */}
            <div 
              onClick={() => requireLogin(() => navigate("/dashboard"))}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-indigo-300"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-50 transition">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold ml-4 text-gray-800">AI Study Predictor</h3>
              </div>
              <p className="text-gray-600">
                Get personalized study predictions based on your learning patterns and goals.
              </p>
              <div className="mt-4 text-blue-600 font-medium flex items-center group-hover:text-blue-700 transition">
                Explore
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Card 2 */}
            <div 
              onClick={() => requireLogin(() => navigate("/resources"))}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-green-300"
            >
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-50 transition">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold ml-4 text-gray-800">Search Resources</h3>
              </div>
              <p className="text-gray-600">
                Discover curated learning materials tailored to your subjects and skill level.
              </p>
              <div className="mt-4 text-green-600 font-medium flex items-center group-hover:text-green-700 transition">
                Explore
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Card 3 */}
            <div 
              onClick={() => requireLogin(() => navigate("/roadmap"))}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-purple-300"
            >
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-50 transition">
                  <span className="text-2xl">🗺️</span>
                </div>
                <h3 className="text-xl font-semibold ml-4 text-gray-800">Learning Roadmap</h3>
              </div>
              <p className="text-gray-600">
                Visualize your learning journey with customized step-by-step roadmaps.
              </p>
              <div className="mt-4 text-purple-600 font-medium flex items-center group-hover:text-purple-700 transition">
                Explore
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Card 4 - Interview Prep */}
            <div 
              onClick={() => requireLogin(() => navigate("/interview-prep"))}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-rose-300"
            >
              <div className="flex items-center mb-4">
                <div className="bg-rose-100 p-3 rounded-lg group-hover:bg-rose-50 transition">
                  <span className="text-2xl">🎤</span>
                </div>
                <h3 className="text-xl font-semibold ml-4 text-gray-800">Interview Prep</h3>
              </div>
              <p className="text-gray-600">
                Practice with AI-powered mock interviews and get detailed feedback.
              </p>
              <div className="mt-4 text-rose-600 font-medium flex items-center group-hover:text-rose-700 transition">
                Explore
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 mb-4">Ready to transform your learning experience?</p>
            <button 
              onClick={() => navigate("/login")}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition transform hover:-translate-y-0.5 font-medium"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
