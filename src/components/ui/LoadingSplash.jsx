import { useEffect, useState } from 'react'

const LoadingSplash = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false)
  const [showPulse, setShowPulse] = useState(false)
  const [showTagline, setShowTagline] = useState(false)

  useEffect(() => {
    // Start pulse after letters animate in
    const pulseTimer = setTimeout(() => setShowPulse(true), 1000)
    
    // Show tagline after pulse starts
    const taglineTimer = setTimeout(() => setShowTagline(true), 1200)
    
    // Fade out and complete
    const exitTimer = setTimeout(() => {
      setFadeOut(true)
      setTimeout(() => onComplete?.(), 300)
    }, 2500)

    return () => {
      clearTimeout(pulseTimer)
      clearTimeout(taglineTimer)
      clearTimeout(exitTimer)
    }
  }, [onComplete])

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-green-50/30 via-white to-green-50/30 flex items-center justify-center z-50 transition-opacity duration-300 ${
      fadeOut ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-green-200 rounded-full animate-float"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          />
        ))}
      </div>
      
      <div className="text-center relative z-10">
        {/* Animated Brand Name with Glow */}
        <div className={`text-5xl sm:text-6xl font-bold flex items-center justify-center transition-all duration-500 ${
          showPulse ? 'drop-shadow-lg' : ''
        }`}>
          <span className="animate-slide-left text-green-500" style={{ animationDelay: '0s' }}>VE</span>
          <span className="animate-drop-down text-green-600" style={{ animationDelay: '0.3s' }}>ND</span>
          <span className="animate-slide-right text-green-500" style={{ animationDelay: '0.6s' }}>LY</span>
        </div>
        
        {/* Animated Tagline */}
        <div className={`mt-4 transition-all duration-500 ${
          showTagline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <p className="text-sm sm:text-base text-gray-600 font-medium tracking-wide">
            Discover • Shop • Connect
          </p>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slide-left {
          0% { transform: translateX(-100px) scale(0.8); opacity: 0; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes drop-down {
          0% { transform: translateY(-100px) scale(0.8); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes slide-right {
          0% { transform: translateX(100px) scale(0.8); opacity: 0; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-slide-left {
          animation: slide-left 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          opacity: 0;
        }
        .animate-drop-down {
          animation: drop-down 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          opacity: 0;
        }
        .animate-slide-right {
          animation: slide-right 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          opacity: 0;
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  )
}

export default LoadingSplash