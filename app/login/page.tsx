"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useColors } from "../../contexts/ColorContext";
import { API_ENDPOINTS, getImageUrl } from "../../lib/api";

export default function LoginPage() {
  const colors = useColors();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [logo, setLogo] = useState("/images/inoo8 With Bg.jpg");
  const router = useRouter();

  useEffect(() => {
    fetchLogo();
  }, []);

  const fetchLogo = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.SITE_SETTINGS);
      if (response.ok) {
        const data = await response.json();
        console.log("Site settings:", data);
        if (data.logo) {
          const logoUrl = getImageUrl(data.logo);
          console.log("Desktop logo URL:", logoUrl);
          setLogo(logoUrl);
        }
      }
    } catch (error) {
      // Use fallback logo
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        // Store token in localStorage
        localStorage.setItem("access_token", data.access);
        // Also set httpOnly cookies via API call
        await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access: data.access, refresh: data.refresh }),
        });
        router.push("/admin/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: colors.primary_color }}
    >

      {/* Login Card */}
      <div
        className="relative z-10 backdrop-blur-lg rounded-2xl shadow-2xl p-10 w-full max-w-md border border-white/20"
        style={{ backgroundColor: "#FAFAFA" }}
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <img
              src={logo}
              alt="Inno8 Logo"
              className="object-contain w-20 h-20"
            />
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{
              background: "linear-gradient(135deg, #012340, #0477BF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Admin Portal
          </h1>
          <p className="text-gray-600">Welcome back to Inno8 Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              id="username"
              type="text"
              required
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300 bg-gray-50/50 peer"
              placeholder=" "
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              onFocus={() => setError("")}
            />
            <label
              htmlFor="username"
              className="absolute left-4 top-4 text-gray-500 transition-all duration-300 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:text-blue-500 origin-left px-1 cursor-text"
              style={{ backgroundColor: "#FAFAFA" }}
            >
              Username
            </label>
          </div>

          <div className="relative">
            <input
              id="password"
              type="password"
              required
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300 bg-gray-50/50 peer"
              placeholder=" "
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              onFocus={() => setError("")}
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-4 text-gray-500 transition-all duration-300 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:text-blue-500 origin-left px-1 cursor-text"
              style={{ backgroundColor: "#FAFAFA" }}
            >
              Password
            </label>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-4 rounded-xl border border-red-200 animate-pulse">
              <svg
                className="w-5 h-5 inline mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:transform-none relative overflow-hidden group"
            style={{ background: "linear-gradient(135deg, #0477BF, #048ABF)" }}
          >
            <span className="relative z-10 flex items-center justify-center">
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </form>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center text-sm font-medium transition-colors duration-300 hover:scale-105 transform"
            style={{ color: "#0477BF" }}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Website
          </a>
        </div>
      </div>
    </div>
  );
}
