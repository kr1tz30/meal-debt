"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Power, Tv, Radio, ArrowLeft, FastForward, Rewind, Volume2, VolumeX, Sparkles } from "lucide-react";

// Sample high quality video URLs for exercise workout channels
const CHANNELS = [
  {
    id: "ch1",
    channelNo: "CH 01",
    name: "90s Fitness VHS • Running Cardio",
    type: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-[#1160]-4320-large.mp4",
    emoji: "🏃",
    kcalRate: "12.5 kcal/min",
    desc: "30-Minute High Intensity Running Workout",
  },
  {
    id: "ch2",
    channelNo: "CH 02",
    name: "Scenic Walking & Jogging VHS",
    type: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-man-runs-on-a-treadmill-in-a-gym-42867-large.mp4",
    emoji: "🚶",
    kcalRate: "6.2 kcal/min",
    desc: "Low Impact Scenic Trail Walk & Jog",
  },
  {
    id: "ch3",
    channelNo: "CH 03",
    name: "Spinning & Cycling Workout",
    type: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-[#4321]-4321-large.mp4",
    emoji: "🚴",
    kcalRate: "14.0 kcal/min",
    desc: "Endurance Road Cycling & Hill Climbs",
  },
  {
    id: "ch4",
    channelNo: "CH 04",
    name: "Le Gourmet Bistro POS Printer",
    type: "iframe",
    src: "/poc/receipt",
    emoji: "🧾",
    kcalRate: "Live POS Terminal",
    desc: "Dispense workout debt receipts",
  },
  {
    id: "ch5",
    channelNo: "CH 05",
    name: "3D Leather Restaurant Menu",
    type: "iframe",
    src: "/menu",
    emoji: "📖",
    kcalRate: "Interactive Menu",
    desc: "Browse 3D menu book & pay bill",
  },
];

export default function RetroTVPage() {
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);
  const [powerOn, setPowerOn] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [vhsEffect, setVhsEffect] = useState(true);

  const activeChannel = CHANNELS[currentChannelIndex];

  function nextChannel() {
    setCurrentChannelIndex((prev) => (prev + 1) % CHANNELS.length);
  }

  function prevChannel() {
    setCurrentChannelIndex((prev) => (prev - 1 + CHANNELS.length) % CHANNELS.length);
  }

  return (
    <main className="relative min-h-screen w-full bg-[#0A0807] overflow-hidden flex flex-col items-center justify-center font-sans">
      
      {/* ── Retro 90s Room & Cabinet Background Image (1:1 Square Format) ── */}
      <Image
        src="/images/retro_tv_square.jpg"
        alt="90s Retro CRT TV Cabinet (1:1 Square)"
        fill
        priority
        className="object-cover opacity-90 scale-105 pointer-events-none"
      />
      <div className="absolute inset-0 bg-black/35 pointer-events-none" />

      {/* Header Bar */}
      <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 hover:bg-black/90 text-amber-300 text-xs font-mono font-bold border border-amber-500/30 backdrop-blur-md transition-all shadow-lg"
        >
          <ArrowLeft size={14} />
          BACK TO RESTAURANT MENU
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setVhsEffect(!vhsEffect)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all border ${
              vhsEffect
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-black/60 text-gray-400 border-gray-700"
            }`}
          >
            {vhsEffect ? "CRT SCANLINES: ON" : "CRT SCANLINES: OFF"}
          </button>
        </div>
      </div>

      {/* ── 90s CRT Silver TV Screen Viewport Pinned Inside 1:1 Cabinet ── */}
      <div className="relative z-20 w-full max-w-[700px] aspect-square flex items-center justify-center p-4">
        
        {/* CRT TV Bezel & Screen Wrapper */}
        <div className="relative w-[42%] h-[34%] mt-[-4%] ml-[-9%] rounded-[18px] bg-black border-4 border-[#222] shadow-[inset_0_0_20px_rgba(0,0,0,0.9),0_0_40px_rgba(0,0,0,0.8)] overflow-hidden flex items-center justify-center">
          
          {/* Power On/Off Cathode Glow Animation (1.0s Duration) */}
          <AnimatePresence mode="wait">
            {powerOn ? (
              <motion.div
                key="screen-on"
                initial={{ scaleY: 0.005, scaleX: 0.1, opacity: 0 }}
                animate={{ scaleY: 1, scaleX: 1, opacity: 1 }}
                exit={{ scaleY: 0.005, scaleX: 0.1, opacity: 0 }}
                transition={{ duration: 1.0, ease: "easeInOut" }}
                className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center"
              >
                {/* Active Channel Content */}
                {activeChannel.type === "video" ? (
                  <video
                    key={activeChannel.src}
                    src={activeChannel.src}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover scale-[1.03]"
                  />
                ) : (
                  <iframe
                    key={activeChannel.src}
                    src={activeChannel.src}
                    className="w-full h-full border-0 scale-90"
                    title={activeChannel.name}
                  />
                )}

                {/* CRT Scanline & Curved Glass Surface Glare Effect */}
                {vhsEffect && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
                      backgroundSize: "100% 3px, 6px 100%",
                    }}
                  />
                )}

                {/* Glass Reflection Glare */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none" />

                {/* Retro 90s OSD (On Screen Display) Header */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[#00FF66] font-mono text-[10px] sm:text-xs font-black tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] pointer-events-none z-30">
                  <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded border border-[#00FF66]/30">
                    <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-ping" />
                    <span>PLAY ▶ {activeChannel.channelNo}</span>
                  </div>
                  <span className="bg-black/60 px-2 py-0.5 rounded border border-[#00FF66]/30">
                    AUTO TRACKING • 1997
                  </span>
                </div>

                {/* Channel Title & Calorie Rate Banner */}
                <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-sm border border-[#00FF66]/30 rounded-lg p-2 flex items-center justify-between text-[#00FF66] font-mono z-30 pointer-events-none">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base">{activeChannel.emoji}</span>
                    <div className="truncate">
                      <p className="text-[10px] sm:text-xs font-bold leading-tight truncate">
                        {activeChannel.name}
                      </p>
                      <p className="text-[8.5px] text-[#00FF66]/70 truncate">
                        {activeChannel.desc}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-[#00FF66]/20 px-2 py-1 rounded shrink-0 border border-[#00FF66]/40">
                    {activeChannel.kcalRate}
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="w-full h-full bg-[#080808] flex flex-col items-center justify-center text-gray-600 font-mono text-xs">
                <Power size={24} className="text-gray-700 mb-1" />
                <span>TV POWER OFF</span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Retro VCR Remote Controls & Channel Tuner Bar ── */}
      <div className="absolute bottom-4 z-40 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 bg-[#1A1412]/90 border border-amber-500/30 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md">
          
          {/* Power Button */}
          <button
            onClick={() => setPowerOn(!powerOn)}
            className={`w-10 h-10 rounded-xl grid place-items-center transition-all ${
              powerOn
                ? "bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.6)]"
                : "bg-gray-800 text-gray-500 hover:bg-gray-700"
            }`}
            title="Power ON/OFF"
          >
            <Power size={18} />
          </button>

          <div className="h-6 w-px bg-amber-500/20 mx-1" />

          {/* Channel UP / DOWN Tuner */}
          <button
            onClick={prevChannel}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-mono text-xs font-bold border border-amber-500/30 transition-all"
          >
            <Rewind size={14} />
            CH ▲
          </button>

          <div className="px-3 py-1.5 rounded-xl bg-black/80 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold">
            {activeChannel.channelNo}
          </div>

          <button
            onClick={nextChannel}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-mono text-xs font-bold border border-amber-500/30 transition-all"
          >
            CH ▼
            <FastForward size={14} />
          </button>

          <div className="h-6 w-px bg-amber-500/20 mx-1" />

          {/* Mute Toggle */}
          {activeChannel.type === "video" && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-10 h-10 rounded-xl grid place-items-center bg-black/60 hover:bg-black/90 text-amber-300 border border-amber-500/30 transition-all"
              title="Toggle Audio Mute"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          )}
        </div>

        {/* Quick Channel Pills */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {CHANNELS.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => {
                setCurrentChannelIndex(idx);
                setPowerOn(true);
              }}
              className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold transition-all border ${
                currentChannelIndex === idx && powerOn
                  ? "bg-amber-400 text-amber-950 border-amber-300 shadow-md scale-105"
                  : "bg-black/70 text-amber-200/70 hover:text-amber-200 border-amber-500/20"
              }`}
            >
              {ch.emoji} {ch.channelNo}
            </button>
          ))}
        </div>
      </div>

    </main>
  );
}
