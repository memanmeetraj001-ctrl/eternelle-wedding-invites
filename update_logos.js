import fs from 'fs';

// 1. Update App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
// Import BrandLogo
if (!app.includes('import { BrandLogo }')) {
  app = "import { BrandLogo } from './components/common/BrandLogo';\n" + app;
}
// Replace the logo markup
app = app.replace(
  /<div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 via-rose-700 to-amber-400 p-0\.5 shadow-lg group-hover:scale-105 transition-transform">[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/,
  `<BrandLogo size="md" showText={false} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg tracking-widest text-amber-100 font-medium">
                ETERNELLER
              </span>
              {user?.plan && (
                <span className={'px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase ' + (
                  user.plan === 'lifetime' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                  user.plan === 'pro' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-stone-900 text-stone-400 border border-stone-800'
                )}>
                  {user.plan === 'lifetime' ? 'Lifetime Creator' : user.plan === 'pro' ? 'Pro Pass' : 'Free'}
                </span>
              )}
            </div>
            <p className="text-[10px] text-stone-400 -mt-0.5 hidden sm:block">
              Interactive Luxury Wedding Invitations & Micro-Sites
            </p>
          </div>`
);
fs.writeFileSync('src/App.tsx', app, 'utf8');

// 2. Update AuthModal.tsx
let auth = fs.readFileSync('src/components/auth/AuthModal.tsx', 'utf8');
if (!auth.includes('import { BrandLogo }')) {
  auth = "import { BrandLogo } from '../common/BrandLogo';\n" + auth;
}
auth = auth.replace(
  /<div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 p-0\.5 mx-auto mb-2 shadow-lg">[\s\S]*?<\/div>[\s\S]*?<\/div>/,
  `<div className="flex justify-center mb-3">
            <BrandLogo size="lg" showText={false} />
          </div>`
);
fs.writeFileSync('src/components/auth/AuthModal.tsx', auth, 'utf8');

// 3. Update LandingPage.tsx
let landing = fs.readFileSync('src/components/landing/LandingPage.tsx', 'utf8');
if (!landing.includes('import { BrandLogo }')) {
  landing = "import { BrandLogo } from '../common/BrandLogo';\n" + landing;
}
landing = landing.replace(
  /<div className="w-6 h-6 rounded-full bg-amber-500\/20 text-amber-400 flex items-center justify-center font-serif font-bold text-xs">[\s\S]*?<\/div>/,
  `<BrandLogo size="sm" showText={false} />`
);
fs.writeFileSync('src/components/landing/LandingPage.tsx', landing, 'utf8');

console.log('Successfully integrated BrandLogo everywhere');
