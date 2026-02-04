"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useColors } from "../contexts/ColorContext";
import { API_ENDPOINTS, getImageUrl } from "../lib/api";
import { fallbackData } from "../lib/fallbackData";

interface AboutContent {
  subtitle: string;
  title: string;
  button_text: string;
  mission_title: string;
  mission_description: string;
  vision_title: string;
  vision_description: string;
  image1: string;
  image2: string;
  floating_text: string;
  overview_description1?: string;
  years_experience?: number;
}

export default function AboutSection() {
  const colors = useColors();
  const [aboutContent, setAboutContent] = useState<AboutContent>(
    fallbackData.aboutSection,
  );
  const [activeTab, setActiveTab] = useState<"mission" | "vision">("mission");

  useEffect(() => {
    fetchAboutContent();

    // Initialize AOS
    import("aos").then((AOS) => {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100,
      });
    });
  }, []);

  const fetchAboutContent = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ABOUT_SECTION);
      if (response.ok) {
        const data = await response.json();
        setAboutContent({
          subtitle: data.subtitle || aboutContent.subtitle,
          title: data.title || aboutContent.title,
          button_text: data.button_text || aboutContent.button_text,
          mission_title: data.mission_title || aboutContent.mission_title,
          mission_description:
            data.mission_description || aboutContent.mission_description,
          vision_title: data.vision_title || aboutContent.vision_title,
          vision_description:
            data.vision_description || aboutContent.vision_description,
          image1: getImageUrl(data.image1) || aboutContent.image1,
          image2: getImageUrl(data.image2) || aboutContent.image2,
          floating_text: data.floating_text || aboutContent.floating_text,
          overview_description1: data.overview_description1,
          years_experience: data.years_experience,
        });
      }
    } catch (error) {
      console.log("Backend offline - using fallback about content");
      setAboutContent(fallbackData.aboutSection);
    }
  };

  return (
    <section
      id="mission"
      className="py-20 bg-gray-50"
      style={{ scrollMarginTop: "100px" }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Content Section */}
          <div data-aos="fade-right">
            {/* Subtitle with left border */}
            <div className="flex items-center mb-6">
              <div
                className="w-12 h-0.5 mr-4"
                style={{ backgroundColor: colors.accent_color }}
              ></div>
              <span className="text-gray-500 uppercase tracking-wider text-sm font-medium">
                {aboutContent.subtitle}
              </span>
            </div>

            <h2
              className="text-4xl lg:text-5xl font-bold mb-6 leading-tight"
              style={{ color: colors.primary_color }}
            >
              {aboutContent.title.split("\n").map((line, index) => (
                <span key={`title-line-${index}`}>
                  {line}
                  {index < aboutContent.title.split("\n").length - 1 && <br />}
                </span>
              ))}
            </h2>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {aboutContent.overview_description1 ||
                "There are many variations of passages about of Lorem Ipsum available, but the majority have suffered alteration free in some form, by injected humour or free randomised words which don't look even slightly."}
            </p>

            {/* Mission/Vision Tabs */}
            <div className="mb-8">
              <div className="flex mb-6">
                <button
                  onClick={() => setActiveTab("mission")}
                  className={`relative px-6 py-3 font-semibold transition-all duration-300 overflow-hidden group ${
                    activeTab === "mission" ? "text-white" : "text-gray-600"
                  }`}
                  style={{
                    backgroundColor:
                      activeTab === "mission"
                        ? colors.primary_color
                        : "transparent",
                    border:
                      activeTab === "mission" ? "none" : "1px solid #d1d5db",
                  }}
                >
                  <span className="relative z-10 group-hover:text-black transition-colors">
                    {aboutContent.mission_title}
                  </span>
                  <div
                    className="absolute inset-0 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out"
                    style={{ backgroundColor: colors.accent_color }}
                  ></div>
                </button>
                <button
                  onClick={() => setActiveTab("vision")}
                  className={`relative px-6 py-3 font-semibold ml-2 transition-all duration-300 overflow-hidden group ${
                    activeTab === "vision" ? "text-white" : "text-gray-600"
                  }`}
                  style={{
                    backgroundColor:
                      activeTab === "vision"
                        ? colors.primary_color
                        : "transparent",
                    border:
                      activeTab === "vision" ? "none" : "1px solid #d1d5db",
                  }}
                >
                  <span className="relative z-10 group-hover:text-black transition-colors">
                    {aboutContent.vision_title}
                  </span>
                  <div
                    className="absolute inset-0 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out"
                    style={{ backgroundColor: colors.accent_color }}
                  ></div>
                </button>
              </div>

              {/* Tab Content */}
              <div className="border-2 border-gray-200 rounded-lg p-6 min-h-[120px] relative overflow-hidden">
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    activeTab === "mission"
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4 absolute inset-0 p-6"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: colors.primary_color }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">
                        {aboutContent.mission_description}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    activeTab === "vision"
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4 absolute inset-0 p-6"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: colors.secondary_color }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">
                        {aboutContent.vision_description}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/about_us"
              className="relative inline-block px-8 py-4 rounded-sm font-medium overflow-hidden group transition-all duration-300 text-white"
              style={{
                color: colors.primary_color,
                border: `1px solid ${colors.primary_color}`,
              }}
            >
              <span className="relative z-10 group-hover:text-white transition-colors">
                {aboutContent.button_text}
              </span>
              <div
                className="absolute inset-0 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out"
                style={{ backgroundColor: colors.primary_color }}
              ></div>
            </Link>
          </div>

          {/* Right Image Section */}
          <div className="relative" data-aos="fade-left">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={aboutContent.image1}
                alt="About Inno8"
                className="w-full h-96 object-cover hover:scale-110 transition-transform duration-500"
              />
              {/* Floating Text Box */}
              <div
                className="absolute bottom-6 left-6 p-4 rounded-lg shadow-lg max-w-md animate-bounce"
                style={{ backgroundColor: colors.accent_color }}
              >
                <p className="text-black text-sm font-medium leading-relaxed">
                  {aboutContent.floating_text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
