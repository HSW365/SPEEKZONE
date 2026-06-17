import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

type ToastCtx = (message: string) => void;
const Ctx = createContext<ToastCtx>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((msg: string) => {
    if (timer.current) clearTimeout(timer.current);
    setMessage(msg);
    timer.current = setTimeout(() => setMessage(null), 2200);
  }, []);

  return (
    <Ctx.Provider value={show}>
      {children}
      {message && (
        <div
          style={{
            position: 'fixed',
            left: '50%',
            bottom: 'calc(96px + env(safe-area-inset-bottom, 0px))',
            transform: 'translateX(-50%)',
            background: 'rgba(20,20,20,.96)',
            border: '1px solid rgba(255,255,255,.12)',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 700,
            zIndex: 9999,
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(14px)',
            boxShadow: '0 8px 30px rgba(0,0,0,.5)',
            animation: 'toastIn .18s ease-out',
            pointerEvents: 'none',
          }}
        >
          {message}
        </div>
      )}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translate(-50%, 8px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </Ctx.Provider>
  );
}

export function useToast() {
  return useContext(Ctx);
}

/** Shares a URL via the native Web Share sheet when available, otherwise copies to clipboard. */
export async function shareOrCopy(data: { title?: string; text?: string; url?: string }, toast: ToastCtx) {
  try {
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      await (navigator as any).share(data);
      return;
    }
    const value = data.url || data.text || data.title || '';
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(value);
      toast('Link copied to clipboard');
    } else {
      toast('Share unavailable on this device');
    }
  } catch (err) {
    // AbortError happens when the user just dismisses the native share sheet — not an error.
    if ((err as any)?.name !== 'AbortError') toast('Could not open share sheet');
  }
}
