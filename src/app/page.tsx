export default function Home() {
  return (
    <div className="h-screen bg-gradient-to-br from-[#0042A6] to-[#07173F] text-white overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-[800px] h-[800px] bg-[#0042A6]/30 rounded-full blur-[200px]" />
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <div className="w-[1000px] h-[200px] bg-[#0042A6]/30 rounded-full blur-[100px]" />
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-4 h-full relative z-10">
              <div className="w-96 h-96 mb-6 flex items-center justify-center relative">
                  <img
                    src="/logo-arkha-blanco.png"
                    alt="ARKHA Logo"
                    className="w-full h-full object-contain"
                  />
              </div>
               <p className="text-xl text-blue-200 mb-10">Space is infinite, but life needs a refuge</p>

          <div className="animate-bounce">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
          </div>
      </div>
    </div>
  );
}