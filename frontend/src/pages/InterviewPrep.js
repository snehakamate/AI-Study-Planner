import React, { useState } from "react";
import axios from "axios";
const API = process.env.REACT_APP_API_BASE || "http://127.0.0.1:5000";

export default function InterviewPrep() {
  const [file, setFile] = useState(null);
  const [emailOrName, setEmailOrName] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [qaPairs, setQaPairs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file || !emailOrName) {
      alert("Please upload a resume and enter your name or email.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("user_id", emailOrName);

    setLoading(true);
    try {
      const response = await axios.post(`${API}/api/interview_questions`, formData);
      setQaPairs(response.data.questions);
    } catch (err) {
      alert("❌ Failed to generate questions from file: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      alert("Please paste your resume text.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/api/interview`, {
        resumeText,
      });
      setQaPairs(response.data.qaPairs);
    } catch (err) {
      alert("❌ Failed to generate questions from text: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">📄 Resume-based Interview Questions</h2>

      {/* ✅ Option 1: File Upload */}
      <form onSubmit={handleUploadSubmit} className="space-y-4 mb-8 p-4 border rounded bg-gray-50">
        <h3 className="text-lg font-medium mb-2">📁 Upload Resume File</h3>
        <div>
          <label className="block font-medium mb-1">Your Email or Name</label>
          <input
            type="text"
            value={emailOrName}
            onChange={(e) => setEmailOrName(e.target.value)}
            placeholder="e.g. john@example.com"
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Upload Resume File</label>
          <input
            type="file"
            accept=".txt,.docx,.pdf"
            onChange={handleFileChange}
            className="w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Generate from File
        </button>
      </form>

      {/* ✅ Option 2: Paste Resume Text */}
      <form onSubmit={handleTextSubmit} className="space-y-4 p-4 border rounded bg-gray-50">
        <h3 className="text-lg font-medium mb-2">✍️ Paste Resume Text</h3>
        <textarea
          rows={8}
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume text here..."
          className="w-full border border-gray-300 p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Generate from Text
        </button>
      </form>

      {loading && <p className="mt-4">⏳ Generating interview questions...</p>}

      {/* ✅ Output */}
      {qaPairs.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">🧠 Interview Questions:</h3>
          {qaPairs.map((qa, index) => (
            <div key={index} className="mb-4">
              <p><strong>Q{index + 1}:</strong> {qa.question}</p>
              <p><strong>A:</strong> {qa.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
