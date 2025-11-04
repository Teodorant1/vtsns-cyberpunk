"use client";

import * as React from "react";

interface ErrorPopupProps {
  visible: boolean;
  message?: string | null;
  onClose?: () => void;
  timeout?: number;
}

export default function ErrorPopup({
  visible,
  message = "AN UNHANDLED ERROR OCCURRED",
  onClose,
  timeout = 10000,
}: ErrorPopupProps) {
  const [isVisible, setIsVisible] = React.useState(visible);

  React.useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  React.useEffect(() => {
    if (isVisible && timeout && onClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [isVisible, timeout, onClose]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-start justify-center">
      <div className="pointer-events-auto mt-28 w-full max-w-lg px-4">
        <div className="rounded-lg border-2 border-red-700 bg-gradient-to-b from-gray-900/90 to-gray-800/80 p-4 text-red-300 shadow-lg transition-all duration-300">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="glitch mb-1 text-lg font-bold">SYSTEM ALERT</h3>
              <p className="whitespace-pre-wrap text-sm text-red-200">
                {message}
              </p>
            </div>

            <div className="flex shrink-0 items-center">
              <button
                onClick={() => {
                  setIsVisible(false);
                  onClose?.();
                }}
                className="ml-4 rounded bg-red-800/80 px-3 py-1 text-xs font-semibold text-red-50 shadow-sm transition hover:bg-red-700/90"
                aria-label="Close error"
              >
                DISMISS
              </button>
            </div>
          </div>

          <div className="mt-3 h-0.5 w-full bg-red-900/60" />

          <div className="mt-3 text-xs text-red-300">
            If the issue persists, contact the sysop or try again later.
          </div>
        </div>
      </div>
    </div>
  );
}
