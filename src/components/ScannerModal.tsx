import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Camera } from 'lucide-react';

interface ScannerModalProps {
  onScan: (texto: string) => void;
  onClose: () => void;
}

export default function ScannerModal({ onScan, onClose }: ScannerModalProps) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader-box', { 
      qrbox: { width: 250, height: 100 }, 
      fps: 10,
    }, false);

    scanner.render(
      (decodedText) => {
        scanner.clear(); 
        onScan(decodedText);
      },
      () => { /* Solucionado el error de la imagen: quitamos la palabra "error" */ }
    );

    return () => {
      scanner.clear().catch(console.error); 
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 p-4 animate-fade-in">
      <button onClick={onClose} className="absolute top-6 right-6 text-white bg-white/20 p-3 rounded-full hover:bg-white/40 transition-colors">
        <X size={24} />
      </button>
      
      <Camera size={48} className="text-ruby-accent mb-4 animate-pulse" />
      <h3 className="text-white font-bold text-xl mb-8">Escanea el IMEI</h3>
      
      <div id="reader-box" className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(225,29,72,0.3)]"></div>
      
      <p className="text-white/50 text-sm mt-8 text-center px-6">Apunta la cámara al código de barras de la caja del celular.</p>
    </div>
  );
}