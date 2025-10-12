// js/main.js
// Stable version: preserve all logic, fix mobile drawer auto-open bug

const $ = (id) => document.getElementById(id);

// DOM ready
document.addEventListener("DOMContentLoaded", () => {
  const burgerBtn = $('burger-menu-btn');
  const mainNav = $('main-nav');
  const commandInput = $('command-input');
  const outputContainer = $('output-container');
  const langSwitcher = $('lang-switcher');
  const modal = $('terminal-modal');
  const terminalBtn = $('terminal-btn');
  const closeTerminalBtn = $('close-terminal');
  const certBtn = $('certBtn');
  const projBtn = $('projBtn');
  const downloadBtn = $('downloadBtn');

  const isMobileView = () => window.innerWidth <= 768;

  // --- [A] Proteksi awal — pastikan nav selalu tertutup saat load/reload ---
  function ensureNavClosed() {
    if (!mainNav) return;
    mainNav.classList.remove('active');
    document.body.classList.remove('menu-active');
    if (burgerBtn) burgerBtn.innerHTML = '☰';
  }

  // Jalankan saat halaman pertama kali dimuat
  ensureNavClosed();

  // Jalankan juga saat halaman di-reload dari bfcache (Safari/iOS bug)
  window.addEventListener('pageshow', () => ensureNavClosed());

  // --- [B] Bahasa & konten ---
  if (!window.langID || !window.langEN || !window.langJP) {
    console.error("Language files not loaded!");
  }

  let currentLang = 'en';
  const commandSets = { id: window.langID?.commands, en: window.langEN?.commands };
  const langData = { id: window.langID?.texts, en: window.langEN?.texts, jp: window.langJP?.texts };

  function renderLang(lang) {
    const data = langData[lang] || {};

    if ($('hello-title')) $('hello-title').innerHTML = data.helloTitle || 'Halo 👋';
    if ($('hello-text')) $('hello-text').innerHTML = data.helloText || '';
    if ($('skills-title')) $('skills-title').innerHTML = data.skillsTitle || 'Kemampuan Teknis';
    if ($('skills-list')) $('skills-list').innerHTML = data.skillsList || '';
    if ($('projects-title')) $('projects-title').innerHTML = data.projectsTitle || 'Kegiatan';
    if ($('projects-desc')) $('projects-desc').innerHTML = data.projectsDesc || '';
    if ($('contact-title')) $('contact-title').innerHTML = data.contactTitle || 'Kontak';

    if (downloadBtn)
      downloadBtn.innerHTML = (lang === 'id') ? "Unduh CV" : (lang === 'en') ? "Download Resume" : "履歴書をダウンロード";
    if (certBtn)
      certBtn.innerHTML = (lang === 'id') ? "Sertifikat" : (lang === 'en') ? "Certificates" : "認定証";
    if (projBtn)
      projBtn.innerHTML = (lang === 'id') ? "Kegiatan" : (lang === 'en') ? "Activity" : "活動";

    if (outputContainer) outputContainer.innerHTML = "";
    if ($('terminal-welcome')) $('terminal-welcome').innerHTML = `<span class="prompt">visitor@portfolio:~$</span> ${data.terminalWelcome || ''}`;
    if ($('terminal-help')) $('terminal-help').innerHTML = data.terminalHelp || '';

    const jpOverlay = $('jp-locked');
    const terminalBox = $('terminal-box');
    if (lang === 'jp') {
      if (jpOverlay) jpOverlay.style.display = 'flex';
      if (terminalBox) terminalBox.style.display = 'none';
    } else {
      if (jpOverlay) jpOverlay.style.display = 'none';
      if (terminalBox) terminalBox.style.display = 'block';
    }
  }

  // --- [C] Burger menu ---
  if (burgerBtn && mainNav) {
    const toggleMenu = () => {
      const willBeActive = !mainNav.classList.contains('active');
      if (willBeActive) {
        mainNav.classList.add('active');
        document.body.classList.add('menu-active');
        burgerBtn.innerHTML = '✕';
      } else {
        ensureNavClosed();
      }
    };

    burgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Tutup menu jika klik item nav (mobile)
    mainNav.querySelectorAll('button, select, a').forEach(item => {
      item.addEventListener('click', () => {
        if (isMobileView()) ensureNavClosed();
      });
    });

    // Tutup jika klik di luar nav
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && !burgerBtn.contains(e.target)) {
        ensureNavClosed();
      }
    });

    // Tutup menu saat resize ke desktop
    window.addEventListener('resize', () => {
      if (!isMobileView()) ensureNavClosed();
    });
  }

  // --- [D] Switcher bahasa ---
  if (langSwitcher) {
    langSwitcher.addEventListener('change', (e) => {
      const lang = e.target.value;
      localStorage.setItem("preferredLang", lang);
      currentLang = lang;
      renderLang(lang);
    });
  }

  const detectBrowserLang = () => {
    const saved = localStorage.getItem("preferredLang");
    if (saved) return saved;
    const lang = navigator.language || navigator.userLanguage || '';
    if (lang.startsWith("id")) return "id";
    if (lang.startsWith("en")) return "en";
    if (lang.startsWith("ja")) return "jp";
    return "en";
  };

  const initialLang = detectBrowserLang();
  if (langSwitcher) langSwitcher.value = initialLang;
  currentLang = initialLang;
  renderLang(initialLang);

  // --- [E] Terminal ---
  function runCommand(cmd) {
    if (cmd === 'clear') {
      if (outputContainer) outputContainer.innerHTML = '';
      return '';
    }
    const set = commandSets[currentLang];
    if (set && set[cmd]) return set[cmd];
    return (currentLang === 'id') ? `Perintah tidak dikenali: ${cmd}` : `Unknown command: ${cmd}`;
  }

  if (commandInput && outputContainer) {
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
  }

  // --- [F] Terminal Modal ---
  if (terminalBtn && closeTerminalBtn && modal) {
    terminalBtn.onclick = () => {
      modal.style.display = 'flex';
      ensureNavClosed();
    };
    closeTerminalBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
  }

  // --- [G] Navigasi & Download ---
  if (certBtn) certBtn.addEventListener('click', () => { window.location.href = "sertifikat.html"; });
  if (projBtn) projBtn.addEventListener('click', () => { window.location.href = "projects/projects.html"; });

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const filePath = (currentLang === 'id') ? 'cv/cv.pdf' : 'cv/resume.pdf';
      const link = document.createElement('a');
      link.href = filePath;
      link.download = filePath.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // --- [H] FOUC fix ---
  document.body.classList.add('js-loaded');
});
