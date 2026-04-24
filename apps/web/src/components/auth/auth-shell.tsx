import React from 'react';

interface AuthShellProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6 md:p-10"
      style={{ background: 'radial-gradient(ellipse at 30% 50%, #3a1800 0%, #1a0900 50%, #0f0500 100%)' }}
    >
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-4 items-stretch">

        {/* ── LEFT PANEL ── */}
        <div
          className="flex-1 rounded-2xl p-8 flex flex-col justify-between min-h-[520px]"
          style={{ background: 'rgba(20,8,0,0.85)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {/* Top badge */}
          <div>
            <span
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full mb-6"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.55)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              Restaurant OS · Live role access
            </span>

            {/* Logo + name */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 11l19-9-9 19-2-8-8-2z"/>
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none">BhojAI</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Spice Garden operations</p>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-black leading-tight mb-4" style={{ color: '#fff' }}>
              Built for front-of-house,{' '}
              <span style={{ color: '#f59e0b' }}>kitchen, and management</span>
            </h1>

            {/* Sub */}
            <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
              A warm, high-contrast workspace for service teams. Switch roles quickly, stay in sync, and keep the floor moving.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { value: '4', label: 'roles ready' },
                { value: '1', label: 'shared login' },
                { value: 'Neon', label: 'live backend' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl px-4 py-3"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <p className="text-white font-bold text-base">{s.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div className="flex flex-col gap-3">
            {[
              'Fast PIN access for shared devices',
              'Separate experiences for waiter, chef, manager, and admin',
              'Consistent dashboard styling across the full app',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div
          className="w-full lg:w-[380px] rounded-2xl flex flex-col"
          style={{ background: '#faf8f5' }}
        >
          {children}
        </div>

      </div>
    </div>
  );
}
