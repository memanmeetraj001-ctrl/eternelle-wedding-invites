import fs from 'fs';

// Fix App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(
  '<div className="w-full h-full bg-stone-950 rounded-full flex items-center justify-center text-amber-300 font-serif font-bold text-sm">\n              ?\n            </div>',
  '<div className="w-full h-full bg-stone-950 rounded-full flex items-center justify-center text-amber-300 font-serif font-bold text-sm">E</div>'
);
app = app.replace(
  "{user.plan === 'lifetime' ? '?? Lifetime' : user.plan === 'pro' ? '?? Pro Pass' : 'Free'}",
  "{user.plan === 'lifetime' ? 'Lifetime Creator' : user.plan === 'pro' ? 'Pro Pass' : 'Free'}"
);
fs.writeFileSync('src/App.tsx', app, 'utf8');

// Fix LandingPage.tsx
let landing = fs.readFileSync('src/components/landing/LandingPage.tsx', 'utf8');
landing = landing.replace(
  '<div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-serif font-bold text-xs">\n              ?\n            </div>',
  '<div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-serif font-bold text-xs">E</div>'
);
landing = landing.replace(
  '<span>? Luxury Interactive Wedding Invitations</span>',
  '<span>- Luxury Interactive Wedding Invitations</span>'
);
landing = landing.replace(
  'Claim Key ??',
  'Claim Key'
);
landing = landing.replace(
  '? 2026 ?ternelle Studio. All rights reserved.',
  '(c) 2026 Eternelle Studio. All rights reserved.'
);
fs.writeFileSync('src/components/landing/LandingPage.tsx', landing, 'utf8');

console.log('Fixed App.tsx and LandingPage.tsx cleanly');
