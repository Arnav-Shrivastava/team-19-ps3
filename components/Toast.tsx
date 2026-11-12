"use client";

import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastMessage = {
  id: string;
  type: "success" | "error" | "info";
  text: string;
};

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-2.5 rounded-2xl border border-white/90 bg-white/90 p-3 shadow-xl backdrop-blur-xl transition-all animate-in fade-in slide-in-from-bottom-2"
        >
          {t.type === "success" && (
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#DDF5E9] text-[#299D78]">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          )}
          {t.type === "error" && (
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <AlertCircle className="h-4 w-4" />
            </div>
          )}
          {t.type === "info" && (
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#F8DCE8] text-[#D98EAE]">
              <Info className="h-4 w-4" />
            </div>
          )}

          <p className="min-w-0 flex-1 text-xs font-medium text-[#172B2A] break-words">
            {t.text}
          </p>

          <button
            onClick={() => onDismiss(t.id)}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[#74827F] hover:bg-slate-100 hover:text-[#172B2A]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
