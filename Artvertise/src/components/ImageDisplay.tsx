import React, { useState } from 'react';
import { Download, Copy, RefreshCw, CheckCircle, Share2, Maximize2 } from 'lucide-react';

interface ImageDisplayProps {
  imageUrl: string;
  prompt: string;
  onGenerateNew: () => void;
  isLoading?: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  imageUrl,
  prompt,
  onGenerateNew,
  isLoading = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showUrlCopied, setShowUrlCopied] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying prompt:', error);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      setShowUrlCopied(true);
      setTimeout(() => setShowUrlCopied(false), 2000);
    } catch (error) {
      console.error('Error copying URL:', error);
    }
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
    document.body.style.overflow = !fullscreen ? 'hidden' : '';
  };

  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fullscreen) {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [fullscreen]);

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-white/20">
      {/* Image Container */}
      <div 
        className={`relative ${
          fullscreen 
            ? 'fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4' 
            : 'aspect-square'
        }`}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Generated artwork"
            className={`
              ${fullscreen 
                ? 'max-h-full max-w-full object-contain' 
                : 'w-full h-full object-cover'
              } 
              ${fullscreen ? 'cursor-zoom-out' : 'cursor-zoom-in'}
            `}
            onClick={toggleFullscreen}
          />
        )}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20 backdrop-blur-sm">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
              <div className="mt-6 text-lg text-white font-medium text-center">Generating...</div>
            </div>
          </div>
        )}
        {fullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors"
          >
            <Maximize2 className="w-8 h-8" />
          </button>
        )}
      </div>

      {/* Prompt Display */}
      <div className="p-8 space-y-6">
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-inner">
          <div className="flex items-start gap-4">
            <p className="flex-1 text-base text-gray-700 leading-relaxed">{prompt}</p>
            <button
              onClick={handleCopyPrompt}
              className={`shrink-0 transition-colors ${copied ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'}`}
              title={copied ? 'Copied!' : 'Copy prompt'}
            >
              {copied ? <CheckCircle className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3 rounded-xl hover:from-rose-600 hover:to-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            disabled={isLoading || !imageUrl}
          >
            <Download className="w-5 h-5" />
            <span className="text-sm font-medium">Download</span>
          </button>
          <button
            onClick={onGenerateNew}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-3 rounded-xl hover:from-gray-800 hover:to-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            disabled={isLoading}
          >
            <RefreshCw className="w-5 h-5" />
            <span className="text-sm font-medium">New</span>
          </button>
          <button
            onClick={toggleFullscreen}
            className="flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl border border-gray-100"
          >
            <Maximize2 className="w-5 h-5" />
            <span className="text-sm font-medium">Full</span>
          </button>
          <button
            onClick={handleShare}
            className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-violet-600 text-white px-6 py-3 rounded-xl hover:from-violet-600 hover:to-violet-700 transition-colors shadow-lg hover:shadow-xl group"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">Share</span>
            {showUrlCopied && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white text-sm py-2 px-4 rounded-lg whitespace-nowrap shadow-lg">
                URL copied!
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageDisplay;