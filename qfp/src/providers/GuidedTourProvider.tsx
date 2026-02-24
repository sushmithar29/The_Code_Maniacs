import React, { createContext, useContext, useMemo, useState } from 'react';

type GuidedStep = {
  target: string;
  content: string;
  action?: () => void;
};

type GuidedTourContextValue = {
  startTour: (title: string, steps: GuidedStep[]) => void;
};

const GuidedTourContext = createContext<GuidedTourContextValue | null>(null);

export function GuidedTourProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState('');
  const [steps, setSteps] = useState<GuidedStep[]>([]);
  const [index, setIndex] = useState(0);

  const active = steps.length > 0;

  const startTour = (tourTitle: string, nextSteps: GuidedStep[]) => {
    setTitle(tourTitle);
    setSteps(nextSteps);
    setIndex(0);
    nextSteps[0]?.action?.();
  };

  const close = () => {
    setSteps([]);
    setIndex(0);
  };

  const next = () => {
    const i = index + 1;
    if (i >= steps.length) {
      close();
      return;
    }
    setIndex(i);
    steps[i]?.action?.();
  };

  const value = useMemo(() => ({ startTour }), []);

  return (
    <GuidedTourContext.Provider value={value}>
      {children}
      {active && (
        <div className="fixed inset-0 z-[1200] pointer-events-none flex items-end justify-center p-20">
          <div className="pointer-events-auto w-full max-w-xl rounded-2xl border border-brand-primary/30 bg-surface/95 backdrop-blur p-16 shadow-xl">
            <div className="text-[10px] font-orbitron text-brand-primary uppercase tracking-[2px] mb-6">
              {title} · {index + 1}/{steps.length}
            </div>
            <p className="text-sm text-text-secondary mb-12">{steps[index]?.content}</p>
            <div className="flex gap-8 justify-end">
              <button onClick={close} className="btn btn-secondary !px-12 !py-6 text-[10px]">Skip</button>
              <button onClick={next} className="btn btn-primary !px-12 !py-6 text-[10px]">
                {index + 1 < steps.length ? 'Next' : 'Finish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </GuidedTourContext.Provider>
  );
}

export function useTour(): GuidedTourContextValue {
  const ctx = useContext(GuidedTourContext);
  if (!ctx) {
    return { startTour: () => {} };
  }
  return ctx;
}
