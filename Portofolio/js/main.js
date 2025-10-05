document.addEventListener("DOMContentLoaded", () => {
  if (!window.langID || !window.langEN || !window.langJP) {
    console.error("Language files not loaded!");
    return;
  }

  let currentLang = 'en';
  let commandSets = { id: langID.commands, en: langEN.commands };
  let langData = { id: langID.texts, en: langEN.texts, jp: langJP.texts };

  const commandInput = document.getElementById('command-input');
  const outputContainer = document.getElementById('output-container');

  function renderLang(lang) {
    const data = langData[lang];

    // Ubah konten utama
    document.getElementById('hello-title').innerHTML = data.helloTitle;
    document.getElementById('hello-text').innerHTML = data.helloText;
    document.getElementById('skills-title').innerHTML = data.skillsTitle;
    document.getElementById('skills-list').innerHTML = data.skillsList;
    document.getElementById('projects-title').innerHTML = data.projectsTitle;
    document.getElementById('projects-desc').innerHTML = data.projectsDesc;
    document.getElementById('contact-title').innerHTML = data.contactTitle;

    // Tombol nav
    const downloadEl = document.getElementById('downloadBtn');
    if (downloadEl) {
      if (lang === 'id') downloadEl.innerHTML = "Unduh CV";
      else if (lang === 'en') downloadEl.innerHTML = "Download Resume";
      else if (lang === 'jp') downloadEl.innerHTML = "履歴書をダウンロード";
    }

    const certEl = document.getElementById('certBtn');
    if (certEl) {
      if (lang === 'id') certEl.innerHTML = "Sertifikat";
      else if (lang === 'en') certEl.innerHTML = "Certificates";
      else if (lang === 'jp') certEl.innerHTML = "認定証";
    }

    const projEl = document.getElementById('projBtn');
    if (projEl) {
      if (lang === 'id') projEl.innerHTML = "Kegiatan";
      else if (lang === 'en') projEl.innerHTML = "Activity";
      else if (lang === 'jp') projEl.innerHTML = "活動";
    }

    // 🔄 Reset terminal setiap ganti bahasa
    outputContainer.innerHTML = "";
    document.getElementById('terminal-welcome').innerHTML =
      `<span class="prompt">visitor@portfolio:~$</span> ${data.terminalWelcome}`;
    document.getElementById('terminal-help').innerHTML = data.terminalHelp;

    // 🔒 Terminal JP terkunci
    const jpOverlay = document.getElementById('jp-locked');
    const terminalBox = document.getElementById('terminal-box');
    if (lang === 'jp') {
      jpOverlay.style.display = 'flex';
      terminalBox.style.display = 'none';
    } else {
      jpOverlay.style.display = 'none';
      terminalBox.style.display = 'block';
    }
  }

  // Event ganti bahasa
  document.getElementById('lang-switcher').addEventListener('change', (e) => {
    const lang = e.target.value;
    localStorage.setItem("preferredLang", lang);
    currentLang = lang;
    renderLang(lang);
  });

  function runCommand(cmd) {
    if (cmd === 'clear') {
      outputContainer.innerHTML = '';
      return '';
    }
    const set = commandSets[currentLang];
    if (set && set[cmd]) return set[cmd];
    return currentLang === 'id' 
      ? `Perintah tidak dikenali: ${cmd}` 
      : `Unknown command: ${cmd}`;
  }

  commandInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = commandInput.value.trim();
      commandInput.value = '';
      const line = document.createElement('div');
      line.className = 'output';
      line.innerHTML = `<span class="prompt">visitor@portfolio:~$</span> ${cmd}`;
      outputContainer.appendChild(line);

      const result = runCommand(cmd);
      if (result) {
        const out = document.createElement('div');
        out.className = 'output';
        out.innerHTML = result;
        outputContainer.appendChild(out);
      }

      outputContainer.scrollTop = outputContainer.scrollHeight;
    }
  });

  // Modal terminal
  const modal = document.getElementById('terminal-modal');
  document.getElementById('terminal-btn').onclick = () => modal.style.display = 'flex';
  document.getElementById('close-terminal').onclick = () => modal.style.display = 'none';
  window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; }

  // Event tombol Sertifikat & Project
  const certBtn = document.getElementById('certBtn');
  if (certBtn) certBtn.addEventListener('click', () => {
    window.location.href = "sertifikat.html";
  });

  const projBtn = document.getElementById('projBtn');
  if (projBtn) projBtn.addEventListener('click', () => {
    window.location.href = "projects.html";
  });

  // ✅ Tambahan tombol download CV/Resume
  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      let filePath = '';
      if (currentLang === 'id') filePath = 'cv/cv.pdf';
      else if (currentLang === 'en') filePath = 'cv/resume.pdf';
      else if (currentLang === 'jp') filePath = 'cv/resume.pdf'; // fallback

      const link = document.createElement('a');
      link.href = filePath;
      link.download = filePath.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Deteksi bahasa awal
  function detectBrowserLang() {
    const saved = localStorage.getItem("preferredLang");
    if (saved) return saved;

    const lang = navigator.language || navigator.userLanguage;
    if (lang.startsWith("id")) return "id";
    if (lang.startsWith("en")) return "en";
    if (lang.startsWith("ja")) return "jp";
    return "en";
  }

  const initialLang = detectBrowserLang();
  document.getElementById("lang-switcher").value = initialLang;
  currentLang = initialLang;
  renderLang(initialLang);
});
