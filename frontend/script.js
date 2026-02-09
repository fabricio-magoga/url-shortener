// Função global para ser acessada pelo onclick do HTML injetado
function copyToClipboard(text, element) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      const originalText = element.textContent;
      element.textContent = "Copiado!";
      // Feedback visual: cor verde temporária
      element.style.color = "#28a745";

      setTimeout(() => {
        element.textContent = originalText;
        element.style.color = ""; // Volta a cor original
      }, 2000);
    })
    .catch((err) => {
      console.error("Erro ao copiar URL: ", err);
      alert("Erro ao copiar. Permissão negada ou navegador incompatível.");
    });
}

document
  .getElementById("shorten-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const originalUrl = document.getElementById("url-input").value;
    const resultDiv = document.getElementById("result");

    // Feedback visual de carregamento
    resultDiv.innerHTML = '<span style="color: #666;">Encurtando...</span>';

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        // Constrói a URL completa
        const shortUrl = `${window.location.origin}/${data.shortUrl}`;

        // Injeta o HTML exatamente como no seu script original
        // Adicionei apenas um title="Clique para copiar" para UX
        resultDiv.innerHTML = `
                URL encurtada: 
                <br>
                <a href="#" onclick="copyToClipboard('${shortUrl}', this); return false;" title="Clique para copiar">
                    ${shortUrl}
                </a>
            `;
      } else {
        const errorMessage = data.errors
          ? data.errors[0].message
          : data.message || "Erro ao encurtar a URL.";

        resultDiv.innerHTML = `<span style="color: #dc3545;">${errorMessage}</span>`;
      }
    } catch (err) {
      console.error(err);
      resultDiv.innerHTML =
        '<span style="color: #dc3545;">Erro de conexão com o servidor.</span>';
    }
  });
