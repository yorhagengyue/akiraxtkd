/**
 * Video Preview Component for Pattern Cards
 * Supports lazy loading and hover preview
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoPreviewProps {
  videoSrc: string;
  patternName: string;
  beltColor: string;
  difficulty: string;
  className?: string;
  autoPreview?: boolean;
}

export default function VideoPreview({ 
  videoSrc, 
  patternName, 
  beltColor, 
  difficulty,
  className = '',
  autoPreview = true 
}: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded) {
            setIsLoaded(true);
          }
        });
      },
      { threshold: 0.25 }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isLoaded]);

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleMouseEnter = () => {
    setShowControls(true);
    if (autoPreview && videoRef.current && !isPlaying) {
      try {
        videoRef.current.currentTime = 0;
        const p = videoRef.current.play();
        if (p && typeof (p as Promise<void>).then === 'function') {
          (p as Promise<void>).then(() => setIsPlaying(true)).catch(() => {
            // Autoplay might be blocked; keep poster and controls visible
            setIsPlaying(false);
          });
        } else {
          setIsPlaying(true);
        }
      } catch (_) {
        setIsPlaying(false);
      }
    }
  };

  const handleMouseLeave = () => {
    setShowControls(false);
    if (autoPreview && videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Belt Color Accent */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 z-10"
        style={{ backgroundColor: beltColor === '#ffffff' ? '#e5e7eb' : beltColor }}
      />

      {/* Video Element */}
      {isLoaded && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onLoadedData={() => console.log(`Video loaded: ${patternName}`)}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Overlay for non-loaded state */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/90 to-gray-900/90 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Play className="w-8 h-8 ml-1" />
            </div>
            <p className="text-sm opacity-80">Loading Preview...</p>
          </div>
        </div>
      )}

      {/* Video Controls Overlay */}
      <div 
        className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          onClick={handlePlay}
          className="w-16 h-16 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white" />
          ) : (
            <Play className="w-8 h-8 text-white ml-1" />
          )}
        </button>
      </div>

      {/* Corner Controls */}
      <div className={`absolute top-3 right-3 flex gap-2 transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        <button
          onClick={handleMute}
          className="w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white" />
          ) : (
            <Volume2 className="w-4 h-4 text-white" />
          )}
        </button>
      </div>

      {/* Pattern Info Overlay */}
      <div className="absolute bottom-3 left-3 text-white">
        <p className="text-xs opacity-80 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
          {patternName}
        </p>
      </div>
    </div>
  );
}
