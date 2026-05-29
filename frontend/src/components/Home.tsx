import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import HeroWaveBackground from './HeroWaveBackground';

const features = [
  {
    num: '01',
    title: 'Live Preview',
    desc: 'Every keystroke updates the preview instantly with no refresh or delay.',
  },
  {
    num: '02',
    title: 'Custom Themes',
    desc: 'Switch between One Dark, VSCode, Dracula, Monokai, and GitHub Light.',
  },
  {
    num: '03',
    title: 'Built-in Console',
    desc: 'Catch logs, warnings, and errors without leaving the editor.',
  },
  {
    num: '04',
    title: 'Responsive Testing',
    desc: 'Preview your output at mobile, tablet, and desktop breakpoints.',
  },
  {
    num: '05',
    title: 'One-click Export',
    desc: 'Download your full project as a single self-contained HTML file.',
  },
];

const terminalLines = [
  { prefix: '~/project', text: ' $ touch index.html style.css app.js', color: '#e8ff47' },
  { prefix: null,        text: '  Created 3 files', color: '#5a5a5a' },
  { prefix: '~/project', text: ' $ codezen .', color: '#e8ff47' },
  { prefix: null,        text: '  Opening editor...', color: '#5a5a5a' },
  { prefix: null,        text: '  Live preview at localhost:3000', color: '#00d9aa' },
  { prefix: null,        text: '  Watching for changes...', color: '#5a5a5a' },
  { prefix: null,        text: '  Ready.', color: '#f2f2f2' },
];

const Home = () => {
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "CodeZen — Minimalist Browser-Based Code Editor";
  }, []);

  useEffect(() => {
    const items = featuresRef.current?.querySelectorAll<HTMLElement>('.feature-item');
    if (!items) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#0d0d0d', color: '#f2f2f2' }}
    >
      <nav
        className="w-full flex items-center justify-between px-6 md:px-12"
        style={{
          height: '56px',
          borderBottom: '1px solid #1f1f1f',
          position: 'sticky',
          top: 0,
          background: 'rgba(13,13,13,0.95)',
          backdropFilter: 'blur(8px)',
          zIndex: 50,
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/assets/logo.png"
            alt="CodeZen"
            style={{ height: '32px', width: 'auto' }}
          />
        </Link>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/bedigambar"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#8a8a8a', fontSize: '16px', transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#f2f2f2')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#8a8a8a')}
            title="GitHub"
          >
            <i className="fa-brands fa-github" />
          </a>
          <a
            href="https://x.com/digambarcodes"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#8a8a8a', fontSize: '14px', transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#f2f2f2')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#8a8a8a')}
            title="X / Twitter"
          >
            <i className="fa-brands fa-x-twitter" />
          </a>
          <Link to="/code" className="btn-accent" style={{ fontSize: '11px', padding: '7px 16px' }}>
            Open Editor
          </Link>
        </div>
      </nav>

      <main className="flex-1">
        <section
          className="w-full px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 relative overflow-hidden"
          style={{ minHeight: 'calc(100vh - 56px)', paddingTop: '80px', paddingBottom: '80px' }}
        >
          <HeroWaveBackground />
          <div className="flex-1 max-w-xl">
            <p
              className="animate-fade-up"
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#e8ff47',
                marginBottom: '24px',
                animationDelay: '0ms',
              }}
            >
              Browser-based code editor
            </p>

            <h1
              className="animate-fade-up"
              style={{
                fontFamily: 'Syne, system-ui, sans-serif',
                fontSize: 'clamp(52px, 8vw, 96px)',
                fontWeight: 800,
                lineHeight: 1.0,
                letterSpacing: '-0.03em',
                color: '#f2f2f2',
                marginBottom: '28px',
                animationDelay: '80ms',
              }}
            >
              Write.
              <br />
              Preview.
              <br />
              Ship.
            </h1>

            <p
              className="animate-fade-up"
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: 1.7,
                color: '#e2e2e2',
                maxWidth: '360px',
                marginBottom: '40px',
                animationDelay: '160ms',
              }}
            >
              HTML, CSS, and JavaScript with live preview, console output, and responsive
              testing. No setup, no installs.
            </p>

            <div
              className="animate-fade-up flex items-center gap-4"
              style={{ animationDelay: '240ms' }}
            >
              <Link to="/code" className="btn-accent">
                Start Coding
                <i className="fa-solid fa-arrow-right" style={{ fontSize: '11px' }} />
              </Link>
              <a
                href="https://github.com/bedigambar/CodeZen-Editor"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <i className="fa-brands fa-github" />
                Source
              </a>
            </div>
          </div>

          <div
            className="flex-1 w-full max-w-lg relative"
            style={{ animationDelay: '300ms' }}
          >
            <div className="hero-glow" />
            <div
              style={{
                background: '#0f0f0f',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                overflow: 'hidden',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '13px',
                lineHeight: '1.7',
                boxShadow: '0 0 60px rgba(232,255,71,0.04), 0 24px 48px rgba(0,0,0,0.6)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  borderBottom: '1px solid #1f1f1f',
                  background: '#111',
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
                <span style={{ marginLeft: '8px', color: '#3a3a3a', fontSize: '11px', letterSpacing: '0.05em' }}>
                  terminal
                </span>
              </div>

              <div style={{ padding: '20px 20px 24px' }}>
                {terminalLines.map((line, i) => (
                  <div
                    key={i}
                    className={`type-line type-line-${i + 1}`}
                    style={{ color: line.color }}
                  >
                    {line.prefix && (
                      <span style={{ color: '#3a3a3a' }}>{line.prefix}</span>
                    )}
                    {line.text}
                  </div>
                ))}
                <span
                  className="animate-type-cursor"
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '14px',
                    background: '#e8ff47',
                    verticalAlign: 'text-bottom',
                    marginTop: '4px',
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section
          ref={featuresRef}
          className="w-full px-6 md:px-12"
          style={{
            paddingTop: '100px',
            paddingBottom: '120px',
            borderTop: '1px solid #1a1a1a',
          }}
        >
          <p
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#8a8a8a',
              marginBottom: '64px',
            }}
          >
            What's inside
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0',
            }}
          >
            {features.map((f, i) => (
              <div
                key={f.num}
                className="feature-item flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8"
                style={{
                  padding: '28px 0',
                  borderBottom: '1px solid #1a1a1a',
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                <span
                  style={{
                    fontFamily: 'Syne, system-ui, sans-serif',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#2a2a2a',
                    letterSpacing: '0.05em',
                    minWidth: '32px',
                    flexShrink: 0,
                  }}
                >
                  {f.num}
                </span>

                <span
                  className="w-full md:w-auto md:min-w-[220px]"
                  style={{
                    fontFamily: 'Syne, system-ui, sans-serif',
                    fontSize: 'clamp(22px, 3vw, 36px)',
                    fontWeight: 700,
                    color: '#f2f2f2',
                    letterSpacing: '-0.02em',
                    flexShrink: 0,
                  }}
                >
                  {f.title}
                </span>

                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#8a8a8a',
                    lineHeight: 1.6,
                    maxWidth: '400px',
                  }}
                >
                  {f.desc}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer
        className="w-full px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{
          height: '56px',
          borderTop: '1px solid #1a1a1a',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
          color: '#8a8a8a',
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/assets/logo.png"
            alt="CodeZen"
            style={{ height: '24px', width: 'auto', opacity: 0.6, transition: 'opacity 0.15s ease' }}
            onMouseEnter={(e) => ((e.target as HTMLImageElement).style.opacity = '1')}
            onMouseLeave={(e) => ((e.target as HTMLImageElement).style.opacity = '0.6')}
          />
        </Link>

        <div className="flex items-center gap-5">
          <a
            href="https://github.com/bedigambar"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#8a8a8a', fontSize: '15px', transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#f2f2f2')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#8a8a8a')}
            title="GitHub"
          >
            <i className="fa-brands fa-github" />
          </a>
          <a
            href="https://www.linkedin.com/in/digambar-behera"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#8a8a8a', fontSize: '15px', transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#f2f2f2')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#8a8a8a')}
            title="LinkedIn"
          >
            <i className="fa-brands fa-linkedin" />
          </a>
          <a
            href="https://x.com/digambarcodes"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#8a8a8a', fontSize: '13px', transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#f2f2f2')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#8a8a8a')}
            title="X / Twitter"
          >
            <i className="fa-brands fa-x-twitter" />
          </a>
        </div>

        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
};

export default Home;
