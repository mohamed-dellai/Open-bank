export default function WelcomeIllustration() {
  return (
    <div className="relative w-full aspect-square">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-3/4 aspect-square">
          {/* Dark gray background circle */}
          <div className="absolute inset-0 bg-[#222222] rounded-full"></div>

          {/* Phone illustration */}
          <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2 w-1/2 h-3/4">
            <div className="relative w-full h-full bg-[#333333] rounded-3xl overflow-hidden">
              {/* Pink line at top */}
              <div className="absolute top-[10%] left-0 w-1/3 h-[2px] bg-[#e91e63]"></div>

              {/* Concentric circles */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="absolute w-16 h-16 rounded-full border border-[#e91e63] opacity-20 animate-ping"></div>
                  <div
                    className="absolute w-12 h-12 rounded-full border border-[#e91e63] opacity-40 animate-ping"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="absolute w-8 h-8 rounded-full border border-[#e91e63] opacity-60 animate-ping"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                  <div className="absolute w-6 h-6 rounded-full bg-[#e91e63] flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Pink line at bottom */}
              <div className="absolute bottom-[10%] right-0 w-1/3 h-[2px] bg-[#e91e63]"></div>
            </div>
          </div>

          {/* Person illustration */}
          <div className="absolute right-1/4 top-1/2 transform -translate-y-1/2">
            <div className="relative w-24 h-32">
              {/* This would be a placeholder for the actual illustration */}
              <div className="absolute inset-0 opacity-0">Person illustration</div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-[15%] right-[15%] w-2 h-2 rounded-full border border-white"></div>
          <div className="absolute top-[25%] right-[25%] text-lg font-bold">+</div>
          <div className="absolute bottom-[20%] left-[20%] w-2 h-2 rounded-full border border-white"></div>
          <div className="absolute bottom-[30%] right-[30%] w-2 h-2 rounded-full border border-white"></div>
        </div>
      </div>
    </div>
  )
}
