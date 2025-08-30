import React, { useState } from "react";
const API = process.env.REACT_APP_API_BASE || "http://127.0.0.1:5000";

export default function Predictor() {
  const [formData, setFormData] = useState({
    failures: "",
    higher: 0,
    absences: "",
    freetime: "",
    goout: "",
    famrel: "",
    famsup: 0,
    schoolsup: 0,
    paid: 0,
    traveltime: "",
    health: "",
    internet: 0,
    age: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      // ✅ Fixed API endpoint (added /predict)
      const response = await fetch(`${API}/api/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          failures: parseInt(formData.failures) || 0,
          higher: parseInt(formData.higher) || 0,
          absences: parseInt(formData.absences) || 0,
          freetime: parseInt(formData.freetime) || 0,
          goout: parseInt(formData.goout) || 0,
          famrel: parseInt(formData.famrel) || 0,
          famsup: parseInt(formData.famsup) || 0,
          schoolsup: parseInt(formData.schoolsup) || 0,
          paid: parseInt(formData.paid) || 0,
          traveltime: parseInt(formData.traveltime) || 0,
          health: parseInt(formData.health) || 0,
          internet: parseInt(formData.internet) || 0,
          age: parseInt(formData.age) || 0
        }),
      });

      const rawText = await response.text();
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} - ${rawText}`);
      }
      if (!rawText || rawText.trim().length === 0) {
        throw new Error("Empty response from server. Please try again later.");
      }
      let data;
      try {
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          data = JSON.parse(rawText);
        } else {
          console.error("Non-JSON response. Raw:", rawText);
          throw new Error("Server returned non-JSON response. Check API base URL and CORS.");
        }
      } catch (e) {
        console.error("Invalid JSON from server. Raw:", rawText);
        throw new Error("Invalid JSON from server. Check API base URL and CORS.");
      }
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to get prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderFormField = (name, label, type = "number", options = null) => {
    if (options) {
      return (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <select
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div key={name}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={`Enter ${label.toLowerCase()}`}
          required
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          📚 AI Study Time Predictor
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Student Information
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {renderFormField("age", "Age")}
                {renderFormField("failures", "Number of Failures")}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {renderFormField("absences", "Absences")}
                {renderFormField("freetime", "Free Time (1-5)")}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {renderFormField("goout", "Going Out (1-5)")}
                {renderFormField("traveltime", "Travel Time (1-4)")}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {renderFormField("famrel", "Family Relationship (1-5)")}
                {renderFormField("health", "Health Status (1-5)")}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {renderFormField("higher", "Higher Education", "select", [
                  { value: 1, label: "Yes" },
                  { value: 0, label: "No" }
                ])}
                {renderFormField("internet", "Internet Access", "select", [
                  { value: 1, label: "Yes" },
                  { value: 0, label: "No" }
                ])}
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {renderFormField("famsup", "Family Support", "select", [
                  { value: 1, label: "Yes" },
                  { value: 0, label: "No" }
                ])}
                {renderFormField("schoolsup", "School Support", "select", [
                  { value: 1, label: "Yes" },
                  { value: 0, label: "No" }
                ])}
                {renderFormField("paid", "Extra Paid Classes", "select", [
                  { value: 1, label: "Yes" },
                  { value: 0, label: "No" }
                ])}
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Predicting...
                  </div>
                ) : (
                  "Predict Study Time"
                )}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Prediction Results
            </h2>
            
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Analyzing your data...</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {result && !loading && (
              <div className="space-y-6">
                {/* Main Prediction */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    📊 Predicted Study Time
                  </h3>
                  <div className="text-3xl font-bold text-green-600">
                    {result.predicted_study_time || result.predicted_hours || "N/A"} hours/day
                  </div>
                </div>
                
                {/* Confidence Level */}
                {result.confidence_level && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">
                      Confidence Level
                    </h4>
                    <div className="flex items-center">
                      <div className="flex-1 bg-blue-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${result.confidence_level.replace('%', '')}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-blue-800">
                        {result.confidence_level}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Key Influencing Factors */}
                {result.key_influencing_factors && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-yellow-800 mb-3">
                      🔍 Key Influencing Factors
                    </h4>
                    <ul className="space-y-2">
                      {Array.isArray(result.key_influencing_factors) ? 
                        result.key_influencing_factors.map((factor, index) => (
                          <li key={index} className="text-sm text-yellow-700 flex items-center">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                            {factor}
                          </li>
                        )) : 
                        <li className="text-sm text-yellow-700">{result.key_influencing_factors}</li>
                      }
                    </ul>
                  </div>
                )}
                
                {/* Personalized Recommendation */}
                {result.recommendation && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-purple-800 mb-2">
                      💡 Personalized Recommendation
                    </h4>
                    <p className="text-sm text-purple-700">
                      {result.recommendation}
                    </p>
                  </div>
                )}
                
                {/* Raw Response for Debugging */}
                {process.env.NODE_ENV === 'development' && (
                  <details className="mt-4">
                    <summary className="text-sm text-gray-500 cursor-pointer">
                      Debug: Raw API Response
                    </summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}
            
            {!result && !loading && !error && (
              <div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p>Fill out the form and submit to get your study time prediction</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
