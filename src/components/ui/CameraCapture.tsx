import { useRef, useState } from 'react';
import { Camera, MapPin } from 'lucide-react';
import { addWatermarkToImage } from '../../utils/watermark';
import { cn } from '../../utils/cn';

interface CameraButtonProps {
  onCapture: (data: { url: string; lat: number | null; lng: number | null; timestamp: string }) => void;
  label?: string;
  className?: string;
  isSecondary?: boolean;
}

export function CameraButton({ onCapture, label = "Tirar Foto", className, isSecondary }: CameraButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const timestamp = new Date().toISOString();

    const processPhoto = async (lat: number | null, lng: number | null) => {
      try {
        const watermarkedUrl = await addWatermarkToImage(file, lat, lng, timestamp);
        setIsProcessing(false);
        onCapture({ url: watermarkedUrl, lat, lng, timestamp });
      } catch (err) {
        console.error(err);
        setIsProcessing(false);
        onCapture({ url: URL.createObjectURL(file), lat, lng, timestamp });
      }
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => processPhoto(position.coords.latitude, position.coords.longitude),
        () => processPhoto(null, null),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      processPhoto(null, null);
    }
  };

  return (
    <div className={cn("w-full flex flex-col gap-3 h-full", className)}>
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={inputRef}
        onChange={handleCapture}
        className="hidden"
      />
      
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isProcessing}
        className={cn(
           "w-full h-full bg-slate-50 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e4b7a] active:scale-[0.98]",
           isSecondary ? "rounded-xl min-h-[140px]" : "aspect-[3/4] rounded-2xl"
        )}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <MapPin className="animate-bounce text-[#1e4b7a]" size={isSecondary ? 24 : 32} />
            <span className="font-medium text-[#1e4b7a] text-center px-2 text-[10px] leading-tight">Processando GPS...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4">
            <div className={`rounded-full bg-white shadow-sm flex items-center justify-center text-[#1e4b7a] border border-slate-100 ${isSecondary ? 'w-10 h-10' : 'w-16 h-16'}`}>
              <Camera size={isSecondary ? 20 : 32} />
            </div>
            <span className={`font-bold text-slate-700 ${isSecondary ? 'text-[11px]' : 'text-sm'}`}>{label}</span>
          </div>
        )}
      </button>
    </div>
  );
}
