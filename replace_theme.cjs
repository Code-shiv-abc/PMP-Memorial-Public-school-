const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Layout/Theme adjustments
      content = content.replace(/\bbg-white\/95\b/g, 'bg-background/95');
      content = content.replace(/\bbg-white\b/g, 'bg-card');
      content = content.replace(/\bbg-slate-50\b/g, 'bg-background');
      content = content.replace(/\bbg-slate-100\b/g, 'bg-muted');
      content = content.replace(/\bbg-slate-800\b/g, 'bg-secondary');
      content = content.replace(/\bbg-slate-900\b/g, 'bg-background');
      content = content.replace(/\bbg-slate-950\b/g, 'bg-background');
      
      // Text
      content = content.replace(/\btext-slate-900\b/g, 'text-foreground');
      content = content.replace(/\btext-slate-800\b/g, 'text-foreground');
      content = content.replace(/\btext-slate-700\b/g, 'text-foreground');
      content = content.replace(/\btext-slate-600\b/g, 'text-muted-foreground');
      content = content.replace(/\btext-slate-500\b/g, 'text-muted-foreground');
      content = content.replace(/\btext-slate-400\b/g, 'text-muted-foreground');
      content = content.replace(/\btext-slate-300\b/g, 'text-muted-foreground');
      content = content.replace(/\btext-slate-200\b/g, 'text-foreground');
      content = content.replace(/\btext-slate-100\b/g, 'text-foreground');
      content = content.replace(/\btext-blue-600\b/g, 'text-primary');
      content = content.replace(/\btext-blue-700\b/g, 'text-primary');
      content = content.replace(/\bbg-blue-50\b/g, 'bg-primary/10');
      content = content.replace(/\bbg-blue-100\b/g, 'bg-primary/20');
      content = content.replace(/\btext-green-600\b/g, 'text-green-400');
      content = content.replace(/\bbg-green-50\b/g, 'bg-green-500/10');
      content = content.replace(/\btext-black\b/g, 'text-[#000000]'); // Protect explicit black
      
      // Borders
      content = content.replace(/\bborder-slate-100\b/g, 'border-border');
      content = content.replace(/\bborder-slate-200\b/g, 'border-border');
      content = content.replace(/\bborder-slate-600\b/g, 'border-border');
      content = content.replace(/\bborder-slate-700\b/g, 'border-border');
      content = content.replace(/\bborder-slate-800\b/g, 'border-border');
      
      // Shadows
      content = content.replace(/\bshadow-slate-200\/50\b/g, 'shadow-none');
      content = content.replace(/\bshadow-slate-200\b/g, 'shadow-none');
      
      // Specific aesthetic tweaks (fonts)
      content = content.replace(/\bfont-bold\b/g, 'font-serif font-bold');
      content = content.replace(/\bfont-semibold\b/g, 'font-serif font-semibold');
      // Fix double serif if it happened
      content = content.replace(/font-serif font-serif/g, 'font-serif');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(path.join(process.cwd(), 'src'));
console.log('Replacements completed.');
