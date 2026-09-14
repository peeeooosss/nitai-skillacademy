export function renderMarkdown(md: string): string {
  let html = md
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-900 border border-white/10 rounded-xl p-4 overflow-x-auto text-sm text-slate-300 my-4 bg-black/40"><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-sm text-cyan-300">$1</code>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-white mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-white mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-white mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-slate-400 italic">$1</em>')
    .replace(/^- (.+)$/gm, '<li class="text-slate-300 ml-4 mb-1 list-disc">• $1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="text-slate-300 ml-4 mb-1 list-decimal">$1</li>')
    .replace(/\n\n/g, '</p><p class="text-slate-300 leading-relaxed mb-3">');
  html = '<p class="text-slate-300 leading-relaxed mb-3">' + html + "</p>";
  return html;
}

export function extractExamples(markdown: string): { html: string | null; raw: string | null } {
  const match = markdown.match(/## Real-World Examples[\s\S]*?(?=## |$)/i);
  if (!match) return { html: null, raw: null };
  return { html: renderMarkdown(match[0]), raw: match[0] };
}