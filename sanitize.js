import fs from 'fs';

// Read all ts/tsx files and replace any mangled unicode characters
const filesToClean = [
  'src/components/landing/LandingPage.tsx',
  'src/components/auth/AuthModal.tsx',
  'src/components/billing/GumroadCheckoutModal.tsx',
  'src/components/marketplace/EtsyDeliveryCenter.tsx',
  'src/components/marketing/PinterestAutomationHub.tsx',
  'src/components/guest/GuestInvitationView.tsx',
  'src/components/guest/EnvelopeExperience.tsx',
  'src/components/guest/RSVPModal.tsx',
  'src/components/editor/InvitationEditor.tsx',
  'src/components/dashboard/RSVPDashboard.tsx',
  'src/App.tsx',
  'src/constants/themes.ts'
];

filesToClean.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Clean replacements for mangled tokens
    content = content
      .replace(/\?\? Featured/g, 'Featured')
      .replace(/\? 100% Mobile/g, '100% Mobile')
      .replace(/\? Re-close/g, 'Re-close')
      .replace(/WHY \?TERNELLER/g, 'WHY ETERNELLER')
      .replace(/\?ternelle/g, 'Eternelle')
      .replace(/\?TERNELLER/g, 'ETERNELLER')
      .replace(/entr\?es/g, 'entrees')
      .replace(/Entr\?e/g, 'Entree')
      .replace(/\? Custom domain/g, '- Custom domain')
      .replace(/\? CSV Export/g, '- CSV Export')
      .replace(/payment \? Lifetime/g, 'payment - Lifetime')
      .replace(/Claim Key \?\?/g, 'Claim Key')
      .replace(/\? 2026/g, '(c) 2026')
      .replace(/Need help\? support/g, 'Need help: support');

    fs.writeFileSync(file, content, 'utf8');
    console.log('Sanitized: ' + file);
  }
});
