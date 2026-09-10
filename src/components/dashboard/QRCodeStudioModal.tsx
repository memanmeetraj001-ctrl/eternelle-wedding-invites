import React, { useRef } from 'react';
import { X, QrCode, Download, Printer, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { WeddingData, ThemeConfig } from '../../types/invitation';

interface QRCodeStudioModalProps {
  wedding: WeddingData;
  theme?: ThemeConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeStudioModal: React.FC<QRCodeStudioModalProps> = ({
  wedding,
  theme,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://eternelle.app';
  const inviteUrl = `${origin}/?invite=${wedding.slug || 'celebration'}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(inviteUrl)}&margin=10&color=2a1810&bgcolor=ffffff`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qrcode_${wedding.slug || 'invitation'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(qrCodeUrl, '_blank');
    }
  };

  const handlePrintSignage = () => {
    window.print();
  };

  const eventTitle = wedding.eventTitle || 
    (wedding.coupleName1 && wedding.coupleName2 ? `${wedding.coupleName1} & ${wedding.coupleName2}` : wedding.honoreeName || 'Our Celebration');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-stone-900 border border-stone-700 text-stone-100 rounded-3xl shadow-2xl overflow-hidden my-4 p-5 sm:p-7 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white rounded-full bg-stone-800/80 transition-colors z-10"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto mb-2 border border-amber-400/30">
            <QrCode size={24} />
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-amber-300/80 font-bold block">
            Print Stationery & Day-Of Signage Kit
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-amber-50 mt-0.5">
            Event QR Code Studio
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Download high-res QR codes for physical invitations, wedding programs, and venue entry check-in.
          </p>
        </div>

        {/* Printable Signage Preview Card */}
        <div 
          ref={printRef}
          className="p-5 rounded-2xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE6] text-stone-900 border border-amber-300/70 shadow-2xl text-center space-y-3 relative overflow-hidden my-1"
        >
          {/* Monogram Top Wax Seal */}
          <div className="w-9 h-9 mx-auto rounded-full bg-amber-900 text-amber-100 flex items-center justify-center shadow-md border border-amber-400/60 font-serif font-bold text-xs">
            {wedding.coupleInitials || 'É'}
          </div>

          <div>
            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-amber-900 font-bold block">
              SCAN TO VIEW INVITATION & RSVP
            </span>
            <h3 className="font-script text-2xl sm:text-3xl text-stone-900 mt-0.5">
              {eventTitle}
            </h3>
            <p className="text-[11px] font-serif italic text-stone-700">
              {wedding.weddingDate} · {wedding.venueName}
            </p>
          </div>

          {/* High Res QR Graphic */}
          <div className="w-40 h-40 mx-auto p-2 bg-white rounded-2xl border border-stone-300 shadow-md flex items-center justify-center">
            <img
              src={qrCodeUrl}
              alt="Event QR Code"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="text-[10px] text-stone-500 font-mono tracking-wider">
            {inviteUrl}
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4">
          <button
            onClick={handleCopyLink}
            className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-amber-400" />}
            <span>{copied ? 'Link Copied!' : 'Copy Invite Link'}</span>
          </button>

          <button
            onClick={handleDownloadQR}
            className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download size={14} className="text-emerald-400" />
            <span>Download PNG</span>
          </button>

          <button
            onClick={handlePrintSignage}
            className="py-2.5 px-3 rounded-xl bg-amber-700 hover:bg-amber-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            <Printer size={14} />
            <span>Print Sign Card</span>
          </button>
        </div>

      </div>
    </div>
  );
};
