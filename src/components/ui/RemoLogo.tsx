import { useState } from 'react';
import { cn } from '../../utils/cn';

interface RemoLogoProps {
  className?: string;
  fallbackSize?: 'sm' | 'lg';
}

export function RemoLogo({ className, fallbackSize = 'lg' }: RemoLogoProps) {
  const [error, setError] = useState(false);
  
  if (error) {
    if (fallbackSize === 'sm') {
      return (
        <div className={cn("flex flex-col items-center select-none justify-center pt-0.5", className)}>
          <div className="flex font-black tracking-tighter leading-none text-[#1e4b7a] text-[24px] items-center">
            <span>REM</span>
            <svg viewBox="0 0 100 100" className="inline-block h-[0.76em] w-[0.76em] ml-[0.01em] overflow-visible">
               <mask id="cut-small">
                 <rect x="-50" y="-50" width="200" height="200" fill="white" />
                 <rect x="37" y="-10" width="26" height="40" fill="black" />
               </mask>
               <circle cx="50" cy="50" r="37" fill="none" stroke="currentColor" strokeWidth="26" mask="url(#cut-small)" />
               <rect x="37" y="-5" width="26" height="33" fill="#32b36b" />
            </svg>
          </div>
          <div className="text-[7.5px] font-bold text-slate-400 tracking-[0.22em] mt-0.5 ml-1">ENGENHARIA</div>
        </div>
      );
    }

    return (
      <div className={cn("flex flex-col items-center select-none justify-center pt-2", className)}>
        <div className="flex font-black tracking-tighter leading-none text-[#1e4b7a] text-[80px] items-center">
          <span>REM</span>
          <svg viewBox="0 0 100 100" className="inline-block h-[0.76em] w-[0.76em] ml-[0.01em] overflow-visible">
             <mask id="cut-large">
               <rect x="-50" y="-50" width="200" height="200" fill="white" />
               <rect x="37" y="-10" width="26" height="40" fill="black" />
             </mask>
             <circle cx="50" cy="50" r="37" fill="none" stroke="currentColor" strokeWidth="26" mask="url(#cut-large)" />
             <rect x="37" y="-5" width="26" height="33" fill="#32b36b" />
          </svg>
        </div>
        <div className="text-[17px] font-bold text-[#88929e] tracking-[0.38em] mt-2 ml-3">ENGENHARIA</div>
      </div>
    );
  }
  
  return (
    <img 
      src="/logo.png" 
      alt="REMO Engenharia" 
      className={cn("object-contain", className)}
      onError={() => setError(true)}
    />
  );
}
