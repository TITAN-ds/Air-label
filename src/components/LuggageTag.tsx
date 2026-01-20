"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { toPng } from "html-to-image";
import { Pencil, Eraser, RotateCcw, Download, ImagePlus, X, ChevronDown } from "lucide-react";

interface TagData {
  countryCode: string;
  cityName: string;
  airline: string;
  aircraft: string;
  date: string;
  purpose: "LEISURE" | "BUSINESS";
  type: "SOLO" | "GROUP";
  passenger: string;
  photo: string | null;
}

interface StickerItem {
  id: string;
  emoji: string;
  x: number;
  y: number;
}

const TRAVEL_STICKERS = ["✈️", "🌍", "🗺️", "🏝️", "🎒", "📸", "🌅", "⛰️", "🏖️", "🚂", "🛳️", "🎭", "🗼", "🗽", "🎡", "⭐"];

const ACCENT_COLORS = [
  { name: "Navy", value: "#1e40af" },
  { name: "Burnt Orange", value: "#ea580c" },
  { name: "Forest", value: "#166534" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Crimson", value: "#dc2626" },
  { name: "Charcoal", value: "#1c1917" },
  { name: "Slate", value: "#64748b" },
  { name: "Sage", value: "#84a98c" },
  { name: "Terracotta", value: "#c2847a" },
  { name: "Dusty Rose", value: "#c9a9a6" },
  { name: "Olive", value: "#6b7c4c" },
  { name: "Steel Blue", value: "#5a7d9a" },
  { name: "Mauve", value: "#9d8189" },
  { name: "Taupe", value: "#8a7968" },
  { name: "Moss", value: "#7d8471" },
  { name: "Clay", value: "#a67c52" },
];

const BACKGROUND_COLORS = [
  { name: "Cream", value: "cream" },
  { name: "Warm White", value: "warm-white" },
  { name: "Cool Gray", value: "cool-gray" },
  { name: "Soft Blue", value: "soft-blue" },
  { name: "Blush", value: "blush" },
  { name: "Mint", value: "mint" },
  { name: "Lavender", value: "lavender" },
  { name: "Sand", value: "sand" },
];

const BACKGROUND_STYLES: Record<string, { base: string; texture: string }> = {
  "cream": {
    base: "linear-gradient(to bottom, rgba(255,252,245,0.97) 0%, rgba(253,250,240,0.95) 50%, rgba(250,245,230,0.98) 100%)",
    texture: "rgba(139,90,43,0.03)",
  },
  "warm-white": {
    base: "linear-gradient(to bottom, rgba(255,255,253,0.98) 0%, rgba(252,250,248,0.96) 50%, rgba(248,246,242,0.98) 100%)",
    texture: "rgba(120,100,80,0.02)",
  },
  "cool-gray": {
    base: "linear-gradient(to bottom, rgba(248,250,252,0.98) 0%, rgba(241,245,249,0.96) 50%, rgba(236,240,244,0.98) 100%)",
    texture: "rgba(100,116,139,0.03)",
  },
  "soft-blue": {
    base: "linear-gradient(to bottom, rgba(248,250,255,0.98) 0%, rgba(240,248,255,0.96) 50%, rgba(235,244,255,0.98) 100%)",
    texture: "rgba(59,130,246,0.02)",
  },
  "blush": {
    base: "linear-gradient(to bottom, rgba(255,250,250,0.98) 0%, rgba(255,245,245,0.96) 50%, rgba(254,240,240,0.98) 100%)",
    texture: "rgba(190,120,120,0.02)",
  },
  "mint": {
    base: "linear-gradient(to bottom, rgba(248,255,252,0.98) 0%, rgba(240,253,248,0.96) 50%, rgba(235,250,244,0.98) 100%)",
    texture: "rgba(52,168,83,0.02)",
  },
  "lavender": {
    base: "linear-gradient(to bottom, rgba(252,250,255,0.98) 0%, rgba(248,245,255,0.96) 50%, rgba(243,240,254,0.98) 100%)",
    texture: "rgba(139,92,246,0.02)",
  },
  "sand": {
    base: "linear-gradient(to bottom, rgba(255,253,248,0.98) 0%, rgba(253,248,240,0.96) 50%, rgba(248,242,230,0.98) 100%)",
    texture: "rgba(180,150,100,0.03)",
  },
};

const AIRCRAFT_TYPES = [
  "BOEING 737",
  "BOEING 747",
  "BOEING 777",
  "BOEING 787",
  "AIRBUS A320",
  "AIRBUS A330",
  "AIRBUS A350",
  "AIRBUS A380",
  "EMBRAER E190",
  "ATR 72",
];

function TagLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <rect x="6" y="4" width="28" height="32" rx="3" fill="currentColor" />
      <circle cx="20" cy="10" r="3" fill="#fffcf5" />
      <rect x="10" y="16" width="20" height="2" rx="1" fill="#fffcf5" opacity="0.6" />
      <rect x="10" y="21" width="14" height="2" rx="1" fill="#fffcf5" opacity="0.4" />
      <rect x="10" y="26" width="18" height="2" rx="1" fill="#fffcf5" opacity="0.3" />
      <path d="M20 4 L20 0 M17 0 L23 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function LuggageTag() {
  const tagRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stickerAreaRef = useRef<HTMLDivElement>(null);

  const [tagData, setTagData] = useState<TagData>({
    countryCode: "USA",
    cityName: "NEW\nYORK",
    airline: "EMIRATES",
    aircraft: "BOEING 777",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase(),
    purpose: "LEISURE",
    type: "SOLO",
    passenger: "TRAVELER",
    photo: null,
  });

  const [isEditingCity, setIsEditingCity] = useState(false);
  const [isEditingCountry, setIsEditingCountry] = useState(false);
  const [isEditingAirline, setIsEditingAirline] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [isEditingPassenger, setIsEditingPassenger] = useState(false);
  const [showAircraftPicker, setShowAircraftPicker] = useState(false);
  const [activeTool, setActiveTool] = useState<"pen" | "eraser" | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [stickers, setStickers] = useState<StickerItem[]>([]);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [accentColor, setAccentColor] = useState("#64748b");
  const [bgColor, setBgColor] = useState("cream");
  const [isDownloading, setIsDownloading] = useState(false);
  const [draggedSticker, setDraggedSticker] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasDrawing, setHasDrawing] = useState(false);
  const [serialNumber] = useState(() => 
    Math.random().toString().substring(2, 12)
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getCanvasCoords = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!activeTool) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, [activeTool, getCanvasCoords]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !activeTool) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    
    if (activeTool === "pen") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "#1c1917";
      ctx.lineWidth = 2;
    } else {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 20;
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawing(true);
  }, [isDrawing, activeTool, getCanvasCoords]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStickers([]);
    setHasDrawing(false);
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTagData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addSticker = (emoji: string) => {
    const newSticker: StickerItem = {
      id: Math.random().toString(36).substring(7),
      emoji,
      x: 100 + Math.random() * 50,
      y: 30 + Math.random() * 50,
    };
    setStickers(prev => [...prev, newSticker]);
    setShowStickerPicker(false);
  };

  const handleStickerMouseDown = (e: React.MouseEvent, stickerId: string) => {
    e.preventDefault();
    const sticker = stickers.find(s => s.id === stickerId);
    if (!sticker || !stickerAreaRef.current) return;
    
    const rect = stickerAreaRef.current.getBoundingClientRect();
    setDraggedSticker(stickerId);
    setDragOffset({
      x: e.clientX - rect.left - sticker.x,
      y: e.clientY - rect.top - sticker.y,
    });
  };

  const handleStickerTouchStart = (e: React.TouchEvent, stickerId: string) => {
    const sticker = stickers.find(s => s.id === stickerId);
    if (!sticker || !stickerAreaRef.current) return;
    
    const rect = stickerAreaRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    setDraggedSticker(stickerId);
    setDragOffset({
      x: touch.clientX - rect.left - sticker.x,
      y: touch.clientY - rect.top - sticker.y,
    });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggedSticker || !stickerAreaRef.current) return;
    
    const rect = stickerAreaRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min(rect.width - 40, e.clientX - rect.left - dragOffset.x));
    const newY = Math.max(0, Math.min(rect.height - 40, e.clientY - rect.top - dragOffset.y));
    
    setStickers(prev => prev.map(s => 
      s.id === draggedSticker ? { ...s, x: newX, y: newY } : s
    ));
  }, [draggedSticker, dragOffset]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!draggedSticker || !stickerAreaRef.current) return;
    
    const rect = stickerAreaRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const newX = Math.max(0, Math.min(rect.width - 40, touch.clientX - rect.left - dragOffset.x));
    const newY = Math.max(0, Math.min(rect.height - 40, touch.clientY - rect.top - dragOffset.y));
    
    setStickers(prev => prev.map(s => 
      s.id === draggedSticker ? { ...s, x: newX, y: newY } : s
    ));
  }, [draggedSticker, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setDraggedSticker(null);
  }, []);

  const removeSticker = (id: string) => {
    setStickers(prev => prev.filter(s => s.id !== id));
  };

  const downloadTag = async () => {
    if (!tagRef.current || isDownloading) return;
    
    setIsDownloading(true);
    setShowAircraftPicker(false);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const dataUrl = await toPng(tagRef.current, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: "transparent",
        cacheBust: true,
      });
      
      const link = document.createElement("a");
      link.download = `airlabel-${tagData.cityName.replace(/\n/g, "-")}-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const getCursorStyle = () => {
    if (activeTool === "pen") return "crosshair";
    if (activeTool === "eraser") return "cell";
    return "default";
  };

  const currentBgStyle = BACKGROUND_STYLES[bgColor];

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 w-full">
      <div className="hidden lg:flex flex-col gap-2 pt-4">
        <button
          onClick={() => setActiveTool(activeTool === "pen" ? null : "pen")}
          className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
            activeTool === "pen"
              ? "bg-[#1c1917] text-white shadow-lg"
              : "bg-white text-[#57534e] hover:bg-[#f5f5f4] hover:text-[#1c1917] border border-[#e7e5e4]"
          }`}
          title="Pen"
        >
          <Pencil className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => setActiveTool(activeTool === "eraser" ? null : "eraser")}
          className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
            activeTool === "eraser"
              ? "bg-[#1c1917] text-white shadow-lg"
              : "bg-white text-[#57534e] hover:bg-[#f5f5f4] hover:text-[#1c1917] border border-[#e7e5e4]"
          }`}
          title="Eraser"
        >
          <Eraser className="w-4 h-4" />
        </button>
        
        <button
          onClick={clearCanvas}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white text-[#57534e] hover:bg-[#f5f5f4] hover:text-[#1c1917] border border-[#e7e5e4] transition-all"
          title="Clear"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="w-full h-px bg-[#e7e5e4] my-1" />

        <div className="relative">
          <button
            onClick={() => { setShowColorPicker(!showColorPicker); setShowStickerPicker(false); setShowBgPicker(false); }}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white hover:bg-[#f5f5f4] border border-[#e7e5e4] transition-all"
            title="Accent Color"
          >
            <div className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: accentColor }} />
          </button>
          
          {showColorPicker && (
            <div className="absolute top-0 left-full ml-2 bg-white rounded-xl shadow-2xl p-3 z-20 border border-[#e7e5e4] w-[200px]">
              <span className="font-sans text-[10px] font-semibold text-[#78716c] uppercase tracking-wider block mb-2">Accent Color</span>
              <div className="grid grid-cols-4 gap-2">
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => { setAccentColor(color.value); setShowColorPicker(false); }}
                    className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${accentColor === color.value ? "ring-2 ring-offset-2 ring-[#1c1917]" : ""}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => { setShowBgPicker(!showBgPicker); setShowColorPicker(false); setShowStickerPicker(false); }}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white hover:bg-[#f5f5f4] border border-[#e7e5e4] transition-all"
            title="Background"
          >
            <div className="w-5 h-5 rounded border-2 border-white shadow-sm" style={{ background: currentBgStyle.base }} />
          </button>
          
          {showBgPicker && (
            <div className="absolute top-0 left-full ml-2 bg-white rounded-xl shadow-2xl p-3 z-20 border border-[#e7e5e4] w-[200px]">
              <span className="font-sans text-[10px] font-semibold text-[#78716c] uppercase tracking-wider block mb-2">Background</span>
              <div className="grid grid-cols-4 gap-2">
                {BACKGROUND_COLORS.map((bg) => (
                  <button
                    key={bg.value}
                    onClick={() => { setBgColor(bg.value); setShowBgPicker(false); }}
                    className={`w-8 h-8 rounded transition-transform hover:scale-110 ${bgColor === bg.value ? "ring-2 ring-offset-2 ring-[#1c1917]" : ""}`}
                    style={{ background: BACKGROUND_STYLES[bg.value].base }}
                    title={bg.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => { setShowStickerPicker(!showStickerPicker); setShowColorPicker(false); setShowBgPicker(false); }}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white hover:bg-[#f5f5f4] border border-[#e7e5e4] transition-all"
            title="Stickers"
          >
            <span className="text-lg">✈️</span>
          </button>
          
          {showStickerPicker && (
            <div className="absolute top-0 left-full ml-2 bg-white rounded-xl shadow-2xl p-3 z-20 border border-[#e7e5e4] w-[180px]">
              <span className="font-sans text-[10px] font-semibold text-[#78716c] uppercase tracking-wider block mb-2">Stickers</span>
              <div className="grid grid-cols-4 gap-1">
                {TRAVEL_STICKERS.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => addSticker(emoji)}
                    className="text-xl hover:scale-125 transition-transform p-1 rounded hover:bg-[#f5f5f4]"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex lg:hidden flex-row flex-wrap items-center justify-center gap-2 w-full max-w-[340px] mb-2">
        <button
          onClick={() => setActiveTool(activeTool === "pen" ? null : "pen")}
          className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg font-sans text-xs font-medium transition-all ${
            activeTool === "pen"
              ? "bg-[#1c1917] text-white shadow-md"
              : "bg-white/80 text-[#57534e] hover:bg-white hover:text-[#1c1917] border border-[#e7e5e4]"
          }`}
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        
        <button
          onClick={() => setActiveTool(activeTool === "eraser" ? null : "eraser")}
          className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg font-sans text-xs font-medium transition-all ${
            activeTool === "eraser"
              ? "bg-[#1c1917] text-white shadow-md"
              : "bg-white/80 text-[#57534e] hover:bg-white hover:text-[#1c1917] border border-[#e7e5e4]"
          }`}
        >
          <Eraser className="w-3.5 h-3.5" />
        </button>
        
        <button
          onClick={clearCanvas}
          className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg font-sans text-xs font-medium bg-white/80 text-[#57534e] hover:bg-white hover:text-[#1c1917] border border-[#e7e5e4] transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="relative">
          <button
            onClick={() => { setShowColorPicker(!showColorPicker); setShowStickerPicker(false); setShowBgPicker(false); }}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg font-sans text-xs font-medium bg-white/80 text-[#57534e] hover:bg-white hover:text-[#1c1917] border border-[#e7e5e4] transition-all"
          >
            <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: accentColor }} />
          </button>
          
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl p-3 z-20 border border-[#e7e5e4] w-[200px]">
              <span className="font-sans text-[10px] font-semibold text-[#78716c] uppercase tracking-wider block mb-2">Accent Color</span>
              <div className="grid grid-cols-4 gap-2">
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => { setAccentColor(color.value); setShowColorPicker(false); }}
                    className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${accentColor === color.value ? "ring-2 ring-offset-2 ring-[#1c1917]" : ""}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => { setShowBgPicker(!showBgPicker); setShowColorPicker(false); setShowStickerPicker(false); }}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg font-sans text-xs font-medium bg-white/80 text-[#57534e] hover:bg-white hover:text-[#1c1917] border border-[#e7e5e4] transition-all"
          >
            <div className="w-4 h-4 rounded border-2 border-white shadow-sm" style={{ background: currentBgStyle.base }} />
          </button>
          
          {showBgPicker && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl p-3 z-20 border border-[#e7e5e4] w-[200px]">
              <span className="font-sans text-[10px] font-semibold text-[#78716c] uppercase tracking-wider block mb-2">Background</span>
              <div className="grid grid-cols-4 gap-2">
                {BACKGROUND_COLORS.map((bg) => (
                  <button
                    key={bg.value}
                    onClick={() => { setBgColor(bg.value); setShowBgPicker(false); }}
                    className={`w-8 h-8 rounded transition-transform hover:scale-110 ${bgColor === bg.value ? "ring-2 ring-offset-2 ring-[#1c1917]" : ""}`}
                    style={{ background: BACKGROUND_STYLES[bg.value].base }}
                    title={bg.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => { setShowStickerPicker(!showStickerPicker); setShowColorPicker(false); setShowBgPicker(false); }}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg font-sans text-xs font-medium bg-white/80 text-[#57534e] hover:bg-white hover:text-[#1c1917] border border-[#e7e5e4] transition-all"
          >
            <span className="text-sm">✈️</span>
          </button>
          
          {showStickerPicker && (
            <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl p-3 z-20 border border-[#e7e5e4] w-[180px]">
              <span className="font-sans text-[10px] font-semibold text-[#78716c] uppercase tracking-wider block mb-2">Stickers</span>
              <div className="grid grid-cols-4 gap-1">
                {TRAVEL_STICKERS.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => addSticker(emoji)}
                    className="text-xl hover:scale-125 transition-transform p-1 rounded hover:bg-[#f5f5f4]"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-end w-full max-w-[340px]">
          <button
            onClick={downloadTag}
            disabled={isDownloading}
            className="flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl font-sans text-sm font-bold tracking-wide transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#0284c7] bg-[length:200%_100%] hover:bg-right"
            style={{ backgroundPosition: isDownloading ? "right" : "left" }}
          >
            <Download className={`w-4 h-4 ${isDownloading ? "animate-bounce" : ""}`} />
            <span>{isDownloading ? "Exporting..." : "Download Tag"}</span>
          </button>
        </div>

        <div 
          ref={tagRef}
          className="relative w-[300px] sm:w-[340px] overflow-hidden"
          style={{ 
            boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05)",
            borderRadius: "12px 12px 0 0",
          }}
        >
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ background: currentBgStyle.base }}
          />
          
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.08]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.02]"
            style={{
              backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(139,90,43,0.5) 1px, rgba(139,90,43,0.5) 2px),
                repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(139,90,43,0.3) 1px, rgba(139,90,43,0.3) 2px)
              `,
              backgroundSize: "4px 4px",
            }}
          />

          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 20% 0%, ${currentBgStyle.texture} 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, ${currentBgStyle.texture} 0%, transparent 50%)` }}
          />

          <div className="relative">
            <div className="flex items-center justify-between px-4 py-3 border-b-2 border-dashed" style={{ borderColor: `${accentColor}30` }}>
              <div className="flex items-center gap-2">
                <TagLogo className="w-4 h-4" style={{ color: accentColor }} />
                <span className="font-ticket text-[8px] tracking-[0.2em] opacity-50" style={{ color: accentColor }}>AIRLABEL</span>
              </div>
              <span className="font-ticket text-[10px] text-[#8b7355] tracking-wider">{serialNumber.slice(0, 6)}</span>
            </div>

            <div className="flex">
              <div 
                className="w-14 flex items-center justify-center py-8 text-white relative overflow-hidden"
                style={{ backgroundColor: accentColor }}
              >
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  }}
                />
                <div 
                  className="cursor-pointer relative"
                  onDoubleClick={() => setIsEditingCountry(true)}
                >
                  {isEditingCountry ? (
                    <input
                      type="text"
                      value={tagData.countryCode}
                      onChange={(e) => setTagData(prev => ({ ...prev, countryCode: e.target.value.toUpperCase().slice(0, 3) }))}
                      onBlur={() => setIsEditingCountry(false)}
                      onKeyDown={(e) => e.key === "Enter" && setIsEditingCountry(false)}
                      autoFocus
                      className="font-ticket-bold text-base tracking-widest text-center bg-transparent border-b border-white/50 outline-none w-10 text-white"
                      style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                      maxLength={3}
                    />
                  ) : (
                    <span 
                      className="font-ticket-bold text-base tracking-widest hover:opacity-80 transition-opacity"
                      style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                    >
                      {tagData.countryCode}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 p-4">
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    {tagData.photo ? (
                      <div className="relative w-full h-24 rounded-lg overflow-hidden border-2" style={{ borderColor: `${accentColor}20` }}>
                        <img 
                          src={tagData.photo} 
                          alt="Trip" 
                          className="w-full h-full object-cover"
                        />
                        {!isDownloading && (
                          <button
                            onClick={() => setTagData(prev => ({ ...prev, photo: null }))}
                            className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div 
                        className="w-full h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all"
                        style={{ 
                          borderColor: isDownloading ? "transparent" : `${accentColor}40`, 
                          color: isDownloading ? "transparent" : accentColor 
                        }}
                      >
                        {!isDownloading && (
                          <>
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="flex flex-col items-center justify-center gap-1 hover:scale-[1.02] transition-transform"
                            >
                              <ImagePlus className="w-5 h-5" />
                              <span className="font-ticket text-[10px]">ADD PHOTO</span>
                            </button>
                          </>
                        )}
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="flex flex-col justify-between text-right">
                    <div>
                      <span className="font-ticket text-[9px] text-[#8b7355] tracking-wider block">AIRLINE</span>
                      <span 
                        className="font-ticket-bold text-xs text-[#2c2416] cursor-pointer hover:opacity-70"
                        onDoubleClick={() => setIsEditingAirline(true)}
                      >
                        {isEditingAirline ? (
                          <input
                            type="text"
                            value={tagData.airline}
                            onChange={(e) => setTagData(prev => ({ ...prev, airline: e.target.value.toUpperCase() }))}
                            onBlur={() => setIsEditingAirline(false)}
                            onKeyDown={(e) => e.key === "Enter" && setIsEditingAirline(false)}
                            autoFocus
                            className="font-ticket-bold text-xs text-right bg-transparent border-b-2 outline-none w-20"
                            style={{ borderColor: accentColor }}
                          />
                        ) : tagData.airline}
                      </span>
                    </div>
                    <div>
                      <span className="font-ticket text-[9px] text-[#8b7355] tracking-wider block">DATE</span>
                      <span 
                        className="font-ticket-bold text-xs text-[#2c2416] cursor-pointer hover:opacity-70"
                        onDoubleClick={() => setIsEditingDate(true)}
                      >
                        {isEditingDate ? (
                          <input
                            type="text"
                            value={tagData.date}
                            onChange={(e) => setTagData(prev => ({ ...prev, date: e.target.value.toUpperCase() }))}
                            onBlur={() => setIsEditingDate(false)}
                            onKeyDown={(e) => e.key === "Enter" && setIsEditingDate(false)}
                            autoFocus
                            className="font-ticket-bold text-xs text-right bg-transparent border-b-2 outline-none w-24"
                            style={{ borderColor: accentColor }}
                          />
                        ) : tagData.date}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-dashed pt-4" style={{ borderColor: `${accentColor}20` }}>
                  <div 
                    className="cursor-pointer mb-4"
                    onDoubleClick={() => setIsEditingCity(true)}
                  >
                    {isEditingCity ? (
                      <textarea
                        value={tagData.cityName}
                        onChange={(e) => setTagData(prev => ({ ...prev, cityName: e.target.value.toUpperCase() }))}
                        onBlur={() => setIsEditingCity(false)}
                        autoFocus
                        className="font-ticket-display text-5xl sm:text-6xl leading-[0.85] tracking-tight bg-transparent border-b-2 outline-none w-full text-[#2c2416] resize-none"
                        style={{ borderColor: accentColor }}
                        rows={2}
                      />
                    ) : (
                      <h1 
                        className="font-ticket-display text-5xl sm:text-6xl leading-[0.85] tracking-tight text-[#2c2416] transition-colors whitespace-pre-line"
                        onMouseEnter={(e) => e.currentTarget.style.color = accentColor}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#2c2416"}
                      >
                        {tagData.cityName}
                      </h1>
                    )}
                  </div>

                  <div className="flex gap-4 mb-3">
                    <div className="flex-1">
                      <span className="font-ticket text-[9px] text-[#8b7355] tracking-wider block mb-1">PURPOSE</span>
                      <div className="flex gap-1">
                        {(["LEISURE", "BUSINESS"] as const).map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setTagData(prev => ({ ...prev, purpose: opt }))}
                            className="font-ticket-bold text-[10px] px-2 py-1 rounded transition-all"
                            style={{
                              backgroundColor: tagData.purpose === opt ? accentColor : "rgba(139,115,85,0.1)",
                              color: tagData.purpose === opt ? "white" : "#8b7355",
                            }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className="font-ticket text-[9px] text-[#8b7355] tracking-wider block mb-1">TYPE</span>
                      <div className="flex gap-1">
                        {(["SOLO", "GROUP"] as const).map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setTagData(prev => ({ ...prev, type: opt }))}
                            className="font-ticket-bold text-[10px] px-2 py-1 rounded transition-all"
                            style={{
                              backgroundColor: tagData.type === opt ? accentColor : "rgba(139,115,85,0.1)",
                              color: tagData.type === opt ? "white" : "#8b7355",
                            }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="font-ticket text-[9px] text-[#8b7355] tracking-wider block mb-1">AIRCRAFT</span>
                    <div className="relative">
                      <button
                        onClick={() => setShowAircraftPicker(!showAircraftPicker)}
                        className="flex items-center justify-between w-full font-ticket-bold text-[10px] px-2 py-1.5 rounded transition-all"
                        style={{
                          backgroundColor: "rgba(139,115,85,0.1)",
                          color: "#2c2416",
                        }}
                      >
                        {tagData.aircraft}
                        <ChevronDown className={`w-3 h-3 text-[#8b7355] transition-opacity ${isDownloading ? "opacity-0" : "opacity-100"}`} />
                      </button>
                      {showAircraftPicker && !isDownloading && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-[#e7e5e4] z-30 max-h-32 overflow-y-auto">
                          {AIRCRAFT_TYPES.map((aircraft) => (
                            <button
                              key={aircraft}
                              onClick={() => { setTagData(prev => ({ ...prev, aircraft })); setShowAircraftPicker(false); }}
                              className="w-full text-left font-ticket text-[10px] px-3 py-1.5 hover:bg-[#f5f5f4] transition-colors"
                              style={{ color: tagData.aircraft === aircraft ? accentColor : "#2c2416" }}
                            >
                              {aircraft}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-dashed pt-3" style={{ borderColor: `${accentColor}20` }}>
                  <span className="font-ticket text-[9px] text-[#8b7355] tracking-wider block mb-1">PASSENGER</span>
                  <span 
                    className="font-ticket-bold text-base text-[#2c2416] cursor-pointer hover:opacity-70"
                    onDoubleClick={() => setIsEditingPassenger(true)}
                  >
                    {isEditingPassenger ? (
                      <input
                        type="text"
                        value={tagData.passenger}
                        onChange={(e) => setTagData(prev => ({ ...prev, passenger: e.target.value.toUpperCase() }))}
                        onBlur={() => setIsEditingPassenger(false)}
                        onKeyDown={(e) => e.key === "Enter" && setIsEditingPassenger(false)}
                        autoFocus
                        className="font-ticket-bold text-base bg-transparent border-b-2 outline-none w-full"
                        style={{ borderColor: accentColor }}
                      />
                    ) : tagData.passenger}
                  </span>
                </div>
              </div>
            </div>

            <div 
              ref={stickerAreaRef}
              className="relative h-28 mx-4 mb-3 rounded-lg" 
              style={{ 
                cursor: getCursorStyle(),
                backgroundColor: (hasDrawing || stickers.length > 0 || isDownloading) ? "transparent" : "rgba(139,115,85,0.03)",
                border: (hasDrawing || stickers.length > 0 || isDownloading) ? "none" : "1px dashed rgba(139,115,85,0.15)",
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
            >
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              {stickers.map((sticker) => (
                <div
                  key={sticker.id}
                  className={`absolute text-2xl select-none transition-transform ${draggedSticker === sticker.id ? "scale-110 cursor-grabbing" : "cursor-grab hover:scale-105"}`}
                  style={{ left: sticker.x, top: sticker.y }}
                  onMouseDown={(e) => handleStickerMouseDown(e, sticker.id)}
                  onTouchStart={(e) => handleStickerTouchStart(e, sticker.id)}
                  onDoubleClick={() => removeSticker(sticker.id)}
                  title="Drag to move, double-click to remove"
                >
                  {sticker.emoji}
                </div>
              ))}
              {!activeTool && stickers.length === 0 && !hasDrawing && !isDownloading && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="font-ticket text-[10px] text-[#c4b89a]">DRAW OR ADD STICKERS</span>
                </div>
              )}
            </div>

            <div className="px-4 pb-2">
              <div 
                className="h-12 w-full rounded-lg overflow-hidden"
                style={{
                  background: `repeating-linear-gradient(
                    90deg,
                    #2c2416 0px,
                    #2c2416 2px,
                    transparent 2px,
                    transparent 5px,
                    #2c2416 5px,
                    #2c2416 6px,
                    transparent 6px,
                    transparent 10px,
                    #2c2416 10px,
                    #2c2416 13px,
                    transparent 13px,
                    transparent 15px,
                    #2c2416 15px,
                    #2c2416 16px,
                    transparent 16px,
                    transparent 20px
                  )`,
                }}
              />
              <div className="flex justify-between items-center mt-2 mb-1">
                <span className="font-ticket text-[9px] text-[#8b7355]">{serialNumber}</span>
                <span className="font-ticket-bold text-[9px]" style={{ color: accentColor }}>PRIORITY</span>
              </div>
            </div>

            <div className="relative pb-1">
              <div className="flex justify-between px-1">
                {[...Array(21)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-3 h-4"
                    style={{ 
                      backgroundColor: "#f5f5f4",
                      borderRadius: "0 0 50% 50%",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
