export async function addWatermarkToImage(
  file: File, 
  lat: number | null, 
  lng: number | null, 
  timestampStr: string
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(objectUrl); // Fallback to original on error
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Setup text style based on image size to scale nicely
      const fontSize = Math.max(24, Math.floor(canvas.height * 0.025));
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textBaseline = 'bottom';
      
      // Background box for visibility
      const textPadding = fontSize * 0.5;
      
      // Setup strings
      const dateStr = `DATA/HORA: ${new Date(timestampStr).toLocaleString('pt-BR')}`;
      const locStr = lat && lng 
        ? `LAT: ${lat.toFixed(6)} | LNG: ${lng.toFixed(6)}`
        : `LOCALIZAÇÃO: Indisponível`;
        
      const line1 = dateStr;
      const line2 = locStr;
      
      const textWidth = Math.max(ctx.measureText(line1).width, ctx.measureText(line2).width);
      
      // Origin at bottom left
      const x = fontSize;
      const yDate = canvas.height - fontSize - textPadding - fontSize;
      const yLoc = canvas.height - fontSize;
      
      // Draw semi-transparent dark background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      // roundRect is relatively modern, fallback to rect if needed but vite uses modern targets
      if (ctx.roundRect) {
        ctx.roundRect(
          x - textPadding, 
          canvas.height - (fontSize * 3) - textPadding, 
          textWidth + (textPadding * 2), 
          (fontSize * 2) + (textPadding * 2), 
          8
        );
      } else {
        ctx.rect(
          x - textPadding, 
          canvas.height - (fontSize * 3) - textPadding, 
          textWidth + (textPadding * 2), 
          (fontSize * 2) + (textPadding * 2) 
        );
      }
      ctx.fill();
      
      // Draw text (White with slight shadow)
      ctx.fillStyle = 'white';
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 4;
      ctx.fillText(line1, x, yDate);
      ctx.fillText(line2, x, yLoc);
      
      // Resolve the watermarked Base64 JPEG URL
      const stampedUrl = canvas.toDataURL('image/jpeg', 0.85);
      URL.revokeObjectURL(objectUrl);
      resolve(stampedUrl);
    };
    
    img.onerror = () => {
      resolve(objectUrl); // Fallback
    };
    
    img.src = objectUrl;
  });
}
