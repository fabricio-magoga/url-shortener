async function copyToClipboard(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    const originalSvg = btn.innerHTML;
    btn.innerHTML = `<span class="text-[10px] font-bold">COPIADO</span>`;
    setTimeout(() => {
      btn.innerHTML = originalSvg;
    }, 2000);
  } catch (err) {
    console.error(err);
  }
}

document
  .getElementById("shorten-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const originalUrl = document.getElementById("url-input").value;
    const resultDiv = document.getElementById("result");

    resultDiv.innerHTML = `<div class="h-10 flex items-center justify-center"><div class="w-4 h-4 border-2 border-zinc-600 border-t-zinc-200 rounded-full animate-spin"></div></div>`;

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        const shortUrl = `${window.location.origin}/${data.shortUrl}`;
        resultDiv.innerHTML = `
                <div class="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <label class="text-xs font-medium text-zinc-400 uppercase tracking-wider">Link Encurtado</label>
                    <div class="flex gap-2">
                        <div class="v0-input flex-1 rounded-md px-3 py-2 text-sm text-zinc-300 truncate font-mono">
                            ${shortUrl}
                        </div>
                        <button onclick="copyToClipboard('${shortUrl}', this)" class="bg-zinc-800 hover:bg-zinc-700 text-white px-3 rounded-md transition-colors border border-zinc-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                        </button>
                    </div>
                </div>
            `;
      } else {
        resultDiv.innerHTML = `<div class="text-xs text-red-400 border border-red-900/50 bg-red-950/20 p-3 rounded-md">${data.message || "Erro."}</div>`;
      }
    } catch (err) {
      resultDiv.innerHTML = `<div class="text-xs text-red-400 border border-red-900/50 bg-red-950/20 p-3 rounded-md">Erro de conexão.</div>`;
    }
  });
