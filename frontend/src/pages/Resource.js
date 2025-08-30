// src/pages/Resource.js
import React, { useState, useMemo } from "react";
import ResourceList from "../components/ResourceList";
const API = process.env.REACT_APP_API_BASE || "http://127.0.0.1:5000";

// Centralized API Service Layer
export const apiService = {
  getResources: async (topic) => {
    const response = await fetch(`${API}/api/resources?topic=${encodeURIComponent(topic)}`);
    if (!response.ok) throw new Error("Failed to fetch resources");
    return response.json();
  },
  predictStudyTime: async (data) => {
    const response = await fetch(`${API}/api/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to predict study time");
    return response.json();
  },
};

export default function Resource() {
  const [query, setQuery] = useState("");
  const [resources, setResources] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "Python",
    "Machine Learning",
    "Data Structures",
    "React",
    "Generative AI",
    "SQL"
  ];

  const handleSearch = async (providedQuery) => {
    const q = (typeof providedQuery === "string" && providedQuery.length > 0)
      ? providedQuery
      : query;
    if (!q.trim()) {
      setSearchError("Please enter a topic.");
      return;
    }
    setSearchError("");
    setResources(null);
    setLoading(true);

    try {
      const data = await apiService.getResources(q);
      setResources(data);
    } catch (err) {
      setSearchError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const useSuggestion = (s) => {
    setQuery(s);
    setSearchError("");
    handleSearch(s);
  };

  // Memoize the resource lists to avoid unnecessary re-renders
  const memoizedResources = useMemo(() => resources, [resources]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center mb-6">🎓 Search Learning Resources</h2>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <label className="block mb-2 font-semibold text-gray-700">
          Enter a topic you want resources for:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g., Python, Machine Learning"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-60"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => useSuggestion(s)}
              className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded hover:bg-green-100"
            >
              {s}
            </button>
          ))}
        </div>

        {searchError && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded p-3 text-center">⚠️ {searchError}</div>
        )}

        {memoizedResources ? (
          <ResourceList resources={memoizedResources} />
        ) : (
          !loading && (
            <p className="text-sm text-gray-500 text-center mt-4">
              Start by entering a topic or pick a suggestion above.
            </p>
          )
        )}
      </div>
    </div>
  );
}

