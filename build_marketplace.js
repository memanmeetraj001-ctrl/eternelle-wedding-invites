import fs from 'fs';

const etsyContent = `import React, { useState } from 'react';
import { 
  ShoppingBag, Key, FileText, QrCode, Download, 
  ExternalLink, Check, Copy, Sparkles, ShieldCheck 
} from 'lucide-react';
import { WeddingData, MarketplaceOrder, ThemeConfig } from '../../types/invitation';
import { INITIAL_ORDERS } from '../../constants/themes';

interface EtsyDeliveryCenterProps {
  wedding: WeddingData;
  theme: ThemeConfig;
}

export const EtsyDeliveryCenter: React.FC<EtsyDeliveryCenterProps> = ({ wedding, theme }) => {
  const [orders, setOrders] = useState<MarketplaceOrder[]>(INITIAL_ORDERS);
  const [newBuyerName, setNewBuyerName] = useState('');
  const [newBuyerEmail, setNewBuyerEmail] = useState('');
  const [platform, setPlatform] = useState<'Etsy' | 'Gumroad'>('Etsy');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedVoucherOrder, setSelectedVoucherOrder] = useState<MarketplaceOrder | null>(INITIAL_ORDERS[0]);

  const handleGenerateCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBuyerName) return;

    const prefix = platform === 'Etsy' ? 'ETSY' : 'GUM';
    const rand = Math.floor(1000 + Math.random() * 9000);
    const code = \`\${prefix}-\${wedding.themeId.toUpperCase().slice(0, 5)}-\${rand}\`;

    const newOrder: MarketplaceOrder = {
      id: 'ord-' + Date.now().toString().slice(-4),
      claimCode: code,
      platform,
      buyerName: newBuyerName,
      buyerEmail: newBuyerEmail || 'buyer@example.com',
      themeSelected: wedding.themeId,
      orderStatus: 'generated',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setOrders([newOrder, ...orders]);
    setSelectedVoucherOrder(newOrder);
    setNewBuyerName('');
    setNewBuyerEmail('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const liveUrl = \`https://eternelle.app/invite/\${wedding.slug}\`;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-6 text-stone-100 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
        <div>
          <span className="text-xs font-mono uppercase text-amber-400 tracking-wider">
            Etsy & Gumroad Digital Product Fulfillment
          </span>
          <h1 className="text-3xl font-serif text-amber-50 mt-1">
            Marketplace Delivery Hub
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Auto-generate unique template claim codes, digital access PDFs, and guest QR codes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs text-amber-300 font-mono">
            Active Theme: {theme.name}
          </span>
        </div>
      </div>

      {/* Top 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Code Generator Form */}
        <div className="lg:col-span-1 bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 text-amber-100">
            <Key size={18} className="text-amber-400" />
            <h3 className="font-serif text-xl">Issue Claim Voucher</h3>
          </div>
          <p className="text-xs text-stone-400">
            Simulate a customer purchasing on Etsy or Gumroad to generate their access token.
          </p>

          <form onSubmit={handleGenerateCode} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-300 font-medium mb-1">Selling Channel</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPlatform('Etsy')}
                  className={\`py-2 rounded-lg border text-center font-medium \${
                    platform === 'Etsy'
                      ? 'border-amber-400 bg-amber-950/60 text-amber-200'
                      : 'border-stone-800 bg-stone-800/40 text-stone-400'
                  }\`}
                >
                  🧡 Etsy Order
                </button>
                <button
                  type="button"
                  onClick={() => setPlatform('Gumroad')}
                  className={\`py-2 rounded-lg border text-center font-medium \${
                    platform === 'Gumroad'
                      ? 'border-pink-400 bg-pink-950/60 text-pink-200'
                      : 'border-stone-800 bg-stone-800/40 text-stone-400'
                  }\`}
                >
                  💖 Gumroad
                </button>
              </div>
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">Customer Full Name *</label>
              <input
                type="text"
                required
                value={newBuyerName}
                onChange={(e) => setNewBuyerName(e.target.value)}
                placeholder="e.g. Jessica Sterling"
                className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">Customer Email (Optional)</label>
              <input
                type="email"
                value={newBuyerEmail}
                onChange={(e) => setNewBuyerEmail(e.target.value)}
                placeholder="jessica@example.com"
                className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs transition-colors shadow-lg flex items-center justify-center gap-1.5"
            >
              <Sparkles size={14} />
              <span>Generate License & PDF Card</span>
            </button>
          </form>
        </div>

        {/* Right: Printable Digital Access PDF Card Preview */}
        <div className="lg:col-span-2 bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-amber-400" />
              <h3 className="font-serif text-xl text-amber-100">
                Etsy Instant Download Voucher Preview
              </h3>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-xs flex items-center gap-1.5"
            >
              <Download size={13} />
              <span>Print / Save PDF</span>
            </button>
          </div>

          {/* Printable Access Voucher Card */}
          <div className="rounded-2xl p-6 bg-stone-950 border-2 border-dashed border-amber-500/40 text-stone-100 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-stone-800">
              <div>
                <span className="text-[10px] tracking-[0.3em] uppercase text-amber-300 font-mono">
                  Official Digital Access Pass
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-amber-50 mt-0.5">
                  {theme.name}
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Thank you for your purchase from our studio!
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-stone-400 block">License Code</span>
                <div className="font-mono text-sm sm:text-base font-bold text-amber-300 bg-amber-950/60 px-3 py-1 rounded-lg border border-amber-700/50 mt-1">
                  {selectedVoucherOrder?.claimCode || 'ETSY-OLIVE-9482'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 text-xs">
              <div className="space-y-2">
                <h4 className="font-medium text-amber-200 uppercase tracking-wider text-[11px]">
                  How to Access Your Template:
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-stone-300 leading-relaxed">
                  <li>Visit our template editor: <strong>eternelle.app/claim</strong></li>
                  <li>Enter your license code: <strong>{selectedVoucherOrder?.claimCode || 'ETSY-OLIVE-9482'}</strong></li>
                  <li>Customize names, dates, schedule & lodging.</li>
                  <li>Click <strong>Publish</strong> to get your shareable link & QR code!</li>
                </ol>
              </div>

              <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 flex flex-col items-center justify-center text-center space-y-2">
                <QrCode size={40} className="text-amber-300" />
                <span className="text-[10px] text-stone-400 font-mono">Scan for Live Interactive Demo</span>
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-amber-400 underline font-medium"
                >
                  {liveUrl}
                </a>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck size={14} /> Commercial Personal License
              </span>
              <span>Need help? support@eternelle.app</span>
            </div>
          </div>
        </div>
      </div>

      {/* Orders & License Table */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-serif text-xl text-amber-100">Issued Marketplace Orders & Codes</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 uppercase tracking-wider font-mono text-[10px]">
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Channel</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Claim Token</th>
                <th className="py-3 px-3">Theme</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-stone-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono text-stone-400">{ord.id}</td>
                  <td className="py-3 px-3">
                    <span className={\`px-2 py-0.5 rounded text-[10px] font-semibold \${
                      ord.platform === 'Etsy' ? 'bg-orange-950 text-orange-300' : 'bg-pink-950 text-pink-300'
                    }\`}>
                      {ord.platform}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-stone-100">{ord.buyerName}</div>
                    <div className="text-[10px] text-stone-500">{ord.buyerEmail}</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-medium text-amber-300">
                    {ord.claimCode}
                  </td>
                  <td className="py-3 px-3 capitalize text-stone-300">{ord.themeSelected}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 text-[10px]">
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(ord.claimCode)}
                      title="Copy Claim Code"
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                    >
                      {copiedCode === ord.claimCode ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                    <button
                      onClick={() => setSelectedVoucherOrder(ord)}
                      className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-[11px] text-amber-300 transition-colors"
                    >
                      View Card
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/components/marketplace/EtsyDeliveryCenter.tsx', etsyContent, 'utf8');
console.log('EtsyDeliveryCenter.tsx created');
