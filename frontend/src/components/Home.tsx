import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-custom">
      <nav className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between animate-slide-in">
        <div className="logo">
          <Link to="/">
            <img 
              src="/assets/logo.png" 
              alt="CodeZen Logo" 
              className="h-8 sm:h-10 md:h-12 w-auto hover:scale-105 transition-transform duration-200"
            />
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <a
            href="https://x.com/digambarcodes"
            className="px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm md:text-base font-semibold rounded-lg transition-all duration-200 hover:scale-105"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="hidden sm:inline">TWITTER</span>
            <i className="fa-brands fa-x-twitter sm:hidden"></i>
          </a>
          <Link
            to="/code"
            className="px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm md:text-base font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <span className="hidden sm:inline">Start Coding</span>
            <span className="sm:hidden">Code</span>
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center animate-fade-in">
        <div className="max-w-5xl mx-auto mb-16 sm:mb-24 px-2">
          <h1 className="text-5xl xs:text-6xl sm:text-7xl md:text-7xl lg:text-8xl font-bold mb-6 sm:mb-8 leading-tight w-full max-w-full px-2">
            <span className="inline-block relative animate-float">
              <span className="relative z-10 bg-gradient-to-r from-white via-purple-300 to-pink-300 text-transparent bg-clip-text animate-gradient-shift">
                Code in Real Time
              </span>
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-lg lg:text-2xl text-gray-200 mb-10 sm:mb-12 max-w-3xl mx-auto font-light leading-relaxed px-2">
            A modern online code editor with live preview, console output, and responsive testing
          </p>
          
          <Link
            to="/code"
            className="inline-block px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 bg-white text-purple-600 text-base sm:text-lg font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
          >
            Start Coding Now →
          </Link>
        </div>

        <div className="w-full max-w-6xl px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8 sm:mb-12 text-center">
            Everything You Need
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-indigo-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                🎨
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-indigo-300 transition-colors">
                Custom Themes
              </h3>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                5 beautiful themes to match your style
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-green-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                🖥️
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-green-300 transition-colors">
                Live Console
              </h3>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                Debug with built-in console for logs and errors
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-blue-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                📱
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-blue-300 transition-colors">
                Device Testing
              </h3>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                Test on mobile, tablet, and desktop views
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                ✨
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-purple-300 transition-colors">
                Auto Format
              </h3>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                Clean code with intelligent formatting
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-pink-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                📚
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-pink-300 transition-colors">
                Ready Templates
              </h3>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                Start fast with professional templates
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-cyan-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                ⚡
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-cyan-300 transition-colors">
                Live Preview
              </h3>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                See your changes instantly with real-time preview updates as you type
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-6 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-4 border-t border-white/10">
        <div className="logo order-1 md:order-1">
          <Link to="/">
            <img 
              src="/assets/logo.png" 
              alt="CodeZen Logo" 
              className="h-7 sm:h-10 w-auto opacity-80 hover:opacity-100 transition-opacity"
            />
          </Link>
        </div>
        
        <div className="flex items-center gap-5 sm:gap-6 md:gap-8 order-2 md:order-3">
          <a
            href="https://github.com/bedigambar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-primary-400 transition-all duration-200 text-xl sm:text-2xl md:text-2xl lg:text-3xl hover:scale-110"
          >
            <i className="fa-brands fa-github"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/digambar-behera"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-primary-400 transition-all duration-200 text-xl sm:text-2xl md:text-2xl lg:text-3xl hover:scale-110"
          >
            <i className="fa-brands fa-linkedin"></i>
          </a>
          <a
            href="https://x.com/digambarcodes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-primary-400 transition-all duration-200 text-xl sm:text-2xl md:text-2xl lg:text-3xl hover:scale-110"
          >
            <i className="fa-brands fa-x-twitter"></i>
          </a>
        </div>
        
        <div className="text-gray-300 text-center text-xs sm:text-base order-3 md:order-2">
          <p>Made with ❤️, by Digambar</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
