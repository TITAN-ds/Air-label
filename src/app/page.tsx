"use client";

import { useState } from "react";
import { LuggageTag } from "@/components/LuggageTag";
import { ArrowRight } from "lucide-react";

function TagLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <rect x="6" y="4" width="28" height="32" rx="3" fill="currentColor" />
      <circle cx="20" cy="10" r="3" fill="#f5f5f4" />
      <rect x="10" y="16" width="20" height="2" rx="1" fill="#f5f5f4" opacity="0.6" />
      <rect x="10" y="21" width="14" height="2" rx="1" fill="#f5f5f4" opacity="0.4" />
      <rect x="10" y="26" width="18" height="2" rx="1" fill="#f5f5f4" opacity="0.3" />
      <path d="M20 4 L20 0 M17 0 L23 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MiniTag({ city, code, color, rotation, className = "" }: { city: string; code: string; color: string; rotation: number; className?: string }) {
  return (
    <div 
      className={`absolute bg-[#fffcf5] rounded-lg shadow-xl border border-[#e7e5e4] overflow-hidden ${className}`}
      style={{ transform: `rotate(${rotation}deg)`, width: "140px" }}
    >
      <div className="flex">
        <div className="w-8 py-4 flex items-center justify-center text-white text-[8px] font-ticket-bold" style={{ backgroundColor: color, writingMode: "vertical-rl" }}>
          {code}
        </div>
        <div className="flex-1 p-2">
          <div className="font-ticket-display text-lg leading-none text-[#1c1917]">{city}</div>
          <div className="mt-1 h-4 w-full rounded overflow-hidden" style={{ background: `repeating-linear-gradient(90deg, #1c1917 0px, #1c1917 1px, transparent 1px, transparent 3px)` }} />
        </div>
      </div>
      <div className="flex justify-between px-1">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="w-2 h-2" style={{ backgroundColor: "#f5f5f4", borderRadius: "0 0 50% 50%" }} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [isDesigning, setIsDesigning] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafaf9] overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, #1c1917 50px, #1c1917 51px),
                           repeating-linear-gradient(90deg, transparent, transparent 50px, #1c1917 50px, #1c1917 51px)`
        }} />
      </div>

      <div className="relative min-h-screen flex">
        <div 
          className={`transition-all duration-700 ease-out flex flex-col justify-center px-6 sm:px-12 lg:px-20 ${
            isDesigning 
              ? "w-0 lg:w-[40%] opacity-0 lg:opacity-100 overflow-hidden" 
              : "w-full lg:w-[50%]"
          }`}
        >
          <div className={`max-w-xl mx-auto lg:mx-0 ${isDesigning ? "lg:max-w-md" : ""}`}>
            <div className="flex items-center gap-2.5 mb-10">
              <TagLogo className="w-8 h-8 text-[#1c1917]" />
              <span className="font-heading text-sm tracking-tight text-[#1c1917]">airlabel</span>
            </div>

            <div className="space-y-2 mb-6">
              <p className="font-body text-sm font-medium text-[#0284c7] tracking-wide uppercase">Create & Personalize</p>
              <h1 className="font-heading text-[2.75rem] sm:text-5xl lg:text-[3.5rem] text-[#1c1917] leading-[1.05] tracking-tight">
                Design Beautiful
                <br />
                <span className="bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] bg-clip-text text-transparent">Luggage Tags</span>
              </h1>
            </div>

            <p className="font-body text-base sm:text-lg text-[#57534e] leading-relaxed mb-10 max-w-md">
              Create personalized airline-style tags that capture your journeys. 
              Add destinations, photos, and custom artwork.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <button
                onClick={() => setIsDesigning(true)}
                className="group flex items-center justify-center gap-3 px-7 py-4 bg-[#1c1917] text-white rounded-xl font-heading text-sm tracking-tight hover:bg-[#0c0a09] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Start Designing
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex flex-wrap gap-6 text-[#78716c]">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 bg-[#0284c7] rounded-full" />
                <span className="font-body text-sm font-medium">Fully Editable</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 bg-[#ea580c] rounded-full" />
                <span className="font-body text-sm font-medium">Custom Artwork</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 bg-[#1c1917] rounded-full" />
                <span className="font-body text-sm font-medium">PNG Export</span>
              </div>
            </div>

            {!isDesigning && (
              <div className="hidden lg:flex mt-16 gap-2 flex-wrap">
                {["TYO", "PAR", "NYC", "DXB", "SYD", "ROM", "BCN", "SFO"].map((code) => (
                  <span key={code} className="font-ticket text-[11px] text-[#a8a29e] px-2.5 py-1.5 bg-[#f5f5f4] rounded-lg">{code}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div 
          className={`transition-all duration-700 ease-out ${
            isDesigning 
              ? "w-full lg:w-[60%] opacity-100 bg-[#f5f5f4]/80" 
              : "hidden lg:block lg:w-[50%]"
          }`}
        >
          {isDesigning ? (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#e7e5e4]">
                <div className="flex items-center gap-2.5">
                  <TagLogo className="w-5 h-5 text-[#0284c7]" />
                  <span className="font-body text-sm font-medium text-[#57534e]">Tag Editor</span>
                </div>
                <button
                  onClick={() => setIsDesigning(false)}
                  className="font-body text-sm font-medium text-[#78716c] hover:text-[#1c1917] transition-colors"
                >
                  Back
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-8 px-4 sm:px-8">
                <LuggageTag />
              </div>
            </div>
          ) : (
            <div className="relative h-full min-h-screen flex items-center justify-center overflow-hidden">
              <div 
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(ellipse at 70% 30%, rgba(2,132,199,0.06) 0%, transparent 50%), radial-gradient(ellipse at 30% 80%, rgba(234,88,12,0.04) 0%, transparent 40%)"
                }}
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full max-w-lg">
                  <MiniTag city="TOKYO" code="TYO" color="#1e40af" rotation={-12} className="float-animation top-[10%] left-[5%]" />
                  <MiniTag city="PARIS" code="CDG" color="#dc2626" rotation={8} className="float-animation-delayed top-[5%] right-[10%]" />
                  <MiniTag city="DUBAI" code="DXB" color="#166534" rotation={-5} className="float-animation top-[35%] left-[15%]" />
                  <MiniTag city="BALI" code="DPS" color="#ea580c" rotation={15} className="float-animation-delayed top-[30%] right-[5%]" />
                  <MiniTag city="ROME" code="FCO" color="#7c3aed" rotation={-8} className="float-animation top-[60%] left-[8%]" />
                  <MiniTag city="NEW YORK" code="JFK" color="#0284c7" rotation={6} className="float-animation-delayed top-[55%] right-[15%]" />
                  <MiniTag city="SYDNEY" code="SYD" color="#64748b" rotation={-3} className="float-animation top-[80%] left-[20%]" />
                </div>
              </div>

              <div className="absolute bottom-8 right-8 flex items-center gap-2 text-[#a8a29e]">
                <span className="font-body text-xs">Your next adventure awaits</span>
                <ArrowRight className="w-3 h-3" />
              </div>

              <div className="absolute top-8 right-8">
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-8 h-10 rounded-lg bg-[#1c1917]/5 border border-[#1c1917]/10"
                      style={{ transform: `rotate(${(i - 1) * 8}deg)` }}
                    />
                  ))}
                </div>
              </div>

              <div className="absolute bottom-12 left-8">
                <div className="flex flex-col gap-1">
                  <div className="flex gap-1">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-1 h-6 bg-[#1c1917]/10 rounded-full" />
                    ))}
                  </div>
                  <span className="font-ticket text-[8px] text-[#a8a29e] tracking-widest">BOARDING</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-1 bg-[#e7e5e4]">
        <div 
          className="h-full bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] transition-all duration-700"
          style={{ width: isDesigning ? "100%" : "0%" }}
        />
      </div>
    </div>
  );
}
