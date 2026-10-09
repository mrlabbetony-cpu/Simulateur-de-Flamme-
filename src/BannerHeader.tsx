/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, X, RefreshCw, Radio } from 'lucide-react';

interface BannerHeaderProps {
  flameColor?: string;
}

export default function BannerHeader({ flameColor }: BannerHeaderProps) {
  const [exactImage, setExactImage] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('banner_exact_image') || null;
    }
    return null;
  });
  const [isPlaying, setIsPlaying] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Check if /banner.png or /banner.jpg exists in public folder
  useEffect(() => {
    const imgPng = new Image();
    imgPng.src = '/banner.png';
    imgPng.onload = () => {
      setExactImage('/banner.png');
    };
    imgPng.onerror = () => {
      const imgJpg = new Image();
      imgJpg.src = '/banner.jpg';
      imgJpg.onload = () => {
        setExactImage('/banner.jpg');
      };
      imgJpg.onerror = () => {
        const saved = localStorage.getItem('banner_exact_image');
        if (saved) setExactImage(saved);
      };
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setExactImage(result);
          try {
            localStorage.setItem('banner_exact_image', result);
          } catch {
            // Storage quota fallback
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearExactImage = () => {
    setExactImage(null);
    try {
      localStorage.removeItem('banner_exact_image');
    } catch {}
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div
      className="w-full relative overflow-hidden rounded-xl border-2 text-white shadow-xl transition-all duration-300"
      style={{
        background: 'linear-gradient(90deg, #06b6d4 0%, #38bdf8 25%, #818cf8 50%, #c084fc 75%, #ec4899 100%)',
        borderColor: flameColor || '#06b6d4',
        boxShadow: flameColor ? `0 0 16px ${flameColor}25` : undefined
      }}
    >
      
      {/* Hidden File Input for Exact Photo Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {exactImage ? (
        /* EXACT USER PHOTO DISPLAY - SLIM REFINED BAND WITH ROUNDED LOGO MEDALLION */
        <div className="relative group w-full overflow-hidden bg-transparent flex items-center justify-center py-1 sm:py-2">
          <img
            src={exactImage}
            alt="Bannière Frappes Cérébrales - La meilleure défense contre l'ignorance"
            onError={() => setExactImage(null)}
            className="w-full h-auto max-h-[175px] sm:max-h-[220px] md:max-h-[250px] object-contain mx-auto block drop-shadow-[0_0_16px_rgba(6,182,212,0.2)] transition-transform duration-500"
          />

          {/* Discreet Control Overlay on Hover */}
          <div className="absolute top-2 right-2 flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2 py-0.5 bg-slate-900/80 hover:bg-slate-950 text-cyan-300 hover:text-cyan-200 border border-cyan-400/50 rounded text-[11px] font-mono flex items-center gap-1 backdrop-blur-md shadow-md transition cursor-pointer"
              title="Changer l'image"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span>Changer</span>
            </button>
            <button
              type="button"
              onClick={clearExactImage}
              className="p-1 bg-slate-900/80 hover:bg-rose-950 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/50 rounded text-[11px] backdrop-blur-md shadow-md transition cursor-pointer"
              title="Supprimer la photo"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      ) : (
        /* REFINED SLIM PROCEDURAL BANNER STRIP - ONLY THE BAND WITH SLOGAN AND LOGO */
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative w-full bg-gradient-to-r from-[#06b6d4] via-[#818cf8] to-[#ec4899] px-3 py-2 sm:px-6 sm:py-3.5 overflow-hidden cursor-pointer group hover:brightness-105 transition-all"
          title="Cliquez pour insérer votre fichier image exact"
        >
          {/* Subtle Cyber Glow Line Behind */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/30 via-transparent to-transparent" />
          </div>

          <div className="absolute top-1.5 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 px-2 py-0.5 rounded text-[10px] text-cyan-300 border border-cyan-500/40 flex items-center gap-1 z-20">
            <ImageIcon className="w-2.5 h-2.5" />
            <span>Changer la photo</span>
          </div>

          {/* Horizontal Banner Strip Layout: Left Slogan / Center Brain Logo / Right Slogan */}
          <div className="relative z-10 flex items-center justify-between gap-2 sm:gap-4 max-w-5xl mx-auto">
            
            {/* LEFT SLOGAN: LA MEILLEURE DÉFENSE */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left select-none leading-none">
              <span className="font-extrabold tracking-widest text-xs sm:text-base lg:text-lg text-cyan-200 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)] uppercase font-sans">
                LA MEILLEURE
              </span>
              <span className="font-black tracking-tight text-xl sm:text-2xl lg:text-3xl text-white drop-shadow-[0_0_14px_rgba(14,165,233,0.9)] uppercase mt-0.5">
                DÉFENSE
              </span>
              <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-white to-transparent mt-1 rounded-full hidden sm:block" />
            </div>

            {/* CENTER: THE BRAIN LOGO MEDALLION */}
            <div className="shrink-0 flex justify-center py-1 px-2">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full p-0.5 bg-gradient-to-b from-cyan-300 via-indigo-600 to-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.6)] border-2 border-pink-300 flex items-center justify-center">
                
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full drop-shadow-[0_0_10px_rgba(236,72,153,0.6)]"
                >
                  <defs>
                    <linearGradient id="brainGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff758f" />
                      <stop offset="50%" stopColor="#e63946" />
                      <stop offset="100%" stopColor="#a4133c" />
                    </linearGradient>

                    <linearGradient id="synapseGlow2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="40%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>

                    <path
                      id="textPathArc2"
                      d="M 28 125 A 72 72 0 0 0 172 125"
                      fill="none"
                    />
                  </defs>

                  <circle cx="100" cy="100" r="92" fill="#18152e" stroke="#ec4899" strokeWidth="2.5" />
                  <circle cx="100" cy="100" r="86" fill="none" stroke="#818cf8" strokeWidth="1" strokeDasharray="3,3" />

                  <g transform="translate(100, 85) scale(0.85)">
                    <path
                      d="M -10 -40 C -35 -40 -65 -20 -65 10 C -65 30 -50 45 -35 48 C -25 50 -15 45 -8 40 Z"
                      fill="url(#brainGrad2)"
                      stroke="#ffb3c1"
                      strokeWidth="2"
                    />
                    <path
                      d="M 10 -40 C 35 -40 65 -20 65 10 C 65 30 50 45 35 48 C 25 50 15 45 8 40 Z"
                      fill="url(#brainGrad2)"
                      stroke="#ffb3c1"
                      strokeWidth="2"
                    />

                    <path
                      d="M -18 38 C -15 50 15 50 18 38 C 28 36 38 46 25 54 C 5 62 -5 62 -25 54 C -38 46 -28 36 -18 38 Z"
                      fill="#334155"
                      stroke="#64748b"
                      strokeWidth="1.5"
                    />

                    <path
                      d="M -50 -10 C -40 0 -25 -5 -15 -15 M -55 12 C -42 18 -30 8 -20 18 M -42 30 C -30 25 -18 32 -10 25"
                      fill="none"
                      stroke="#590d22"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 50 -10 C 40 0 25 -5 15 -15 M 55 12 C 42 18 30 8 20 18 M 42 30 C 30 25 18 32 10 25"
                      fill="none"
                      stroke="#590d22"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    <g className="animate-pulse">
                      <path
                        d="M 0 -35 L -3 -15 L 4 -5 L -2 15 L 0 35"
                        fill="none"
                        stroke="url(#synapseGlow2)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <circle cx="0" cy="-5" r="4" fill="#ffffff" filter="drop-shadow(0 0 6px #38bdf8)" />
                      <circle cx="-12" cy="10" r="2.5" fill="#38bdf8" />
                      <circle cx="12" cy="5" r="2.5" fill="#38bdf8" />
                    </g>
                  </g>

                  <text
                    fill="#ec4899"
                    fontSize="13.5"
                    fontWeight="900"
                    letterSpacing="3"
                    className="font-sans drop-shadow-[0_0_8px_rgba(236,72,153,0.9)]"
                  >
                    <textPath href="#textPathArc2" startOffset="50%" textAnchor="middle">
                      FRAPPES CÉRÉBRALES
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>

            {/* RIGHT SLOGAN: CONTRE L'IGNORANCE */}
            <div className="flex-1 flex flex-col items-center md:items-end text-center md:text-right select-none leading-none">
              <span className="font-extrabold tracking-widest text-xs sm:text-base lg:text-lg text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.7)] uppercase font-sans">
                CONTRE
              </span>
              <span className="font-black tracking-tight text-xl sm:text-2xl lg:text-3xl text-transparent bg-clip-text bg-gradient-to-l from-pink-400 via-rose-300 to-purple-300 drop-shadow-[0_0_14px_rgba(236,72,153,0.9)] uppercase mt-0.5">
                L'IGNORANCE
              </span>
              <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-l from-pink-500 to-transparent mt-1 rounded-full hidden sm:block" />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
