// src/pages/Roadmap.js
import React, { useEffect, useMemo, useRef, useState } from "react";
const API = process.env.REACT_APP_API_BASE || "http://127.0.0.1:5000";

export default function Roadmap() {
  const [topic, setTopic] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const resultRef = useRef(null);

  const suggestions = [
    "Python",
    "Machine Learning",
    "Data Structures",
    "React",
    "Generative AI",
    "SQL"
  ];

  const steps = useMemo(() => {
    if (!roadmap) return [];
    return roadmap
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }, [roadmap]);

  const handleGenerate = async (providedTopic) => {
    const topicToUse = (typeof providedTopic === "string" && providedTopic.length > 0)
      ? providedTopic
      : topic;

    if (!topicToUse.trim()) {
      setError("Please enter a topic.");
      return;
    }

    setError("");
    setRoadmap(null);
    setLoading(true);

    try {
      const response = await fetch(`${API}/api/roadmap?topic=${encodeURIComponent(topicToUse)}`);
      if (!response.ok) throw new Error("Failed to generate roadmap");
      const data = await response.json();

      if (data && data.roadmap) {
        setRoadmap(data.roadmap);
        // Ensure input shows the actual topic used
        if (topic !== topicToUse) setTopic(topicToUse);
        setTimeout(() => {
          if (resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 50);
      } else {
        setError("Failed to generate roadmap.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleCopy = async () => {
    if (!roadmap) return;
    try {
      await navigator.clipboard.writeText(roadmap);
      alert("Roadmap copied to clipboard!");
    } catch (e) {
      console.error(e);
      alert("Failed to copy. Please try manually.");
    }
  };

  const handleDownload = () => {
    if (!roadmap) return;
    const blob = new Blob([roadmap], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topic || "roadmap"}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleUseSuggestion = (s) => {
    setTopic(s);
    setError("");
    handleGenerate(s);
  };

  useEffect(() => {
    if (error && topic) setError("");
  }, [topic]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-purple-700">📍 AI Study Roadmap</h1>

      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <label className="block mb-2 font-semibold text-gray-700">
          Enter a topic you want a roadmap for:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g., Python, Machine Learning"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="whitespace-nowrap bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleUseSuggestion(s)}
              className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-1 rounded hover:bg-purple-100"
            >
              {s}
            </button>
          ))}
        </div>

        {error && <p className="text-red-600 mt-4 text-center">⚠️ {error}</p>}
        {loading && (
          <div className="mt-6 flex items-center justify-center text-gray-600">
            <svg className="animate-spin h-5 w-5 mr-2 text-purple-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            Generating roadmap...
          </div>
        )}

        {!roadmap && !loading && !error && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Start by entering a topic or pick a suggestion above.
          </div>
        )}

        {roadmap && (
          <div ref={resultRef} className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-green-700">🛣️ Roadmap</h2>
              <div className="flex items-center gap-2">
                <button onClick={handleCopy} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded border hover:bg-gray-200">Copy</button>
                <button onClick={handleDownload} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded border hover:bg-gray-200">Download</button>
              </div>
            </div>

            <ul className="mt-4 space-y-3">
              {steps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-1 bg-green-50 border border-green-200 rounded p-3 text-gray-800">
                    {step}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 text-right">
              <button
                onClick={() => { setRoadmap(null); setTopic(""); }}
                className="text-xs text-purple-700 hover:underline"
              >
                Clear and create another
              </button>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
