// js/main.js

// --- Burger Menu Elements (diakses sebelum DOMContentLoaded) ---
const burgerBtn = document.getElementById('burger-menu-btn');
const mainNav = document.getElementById('main-nav');

// 🚫 Pastikan menu tertutup saat load halaman
if (mainNav) {
    mainNav.classList.remove('active');
    document.body.classList.remove('menu-active');
}

// 🔍 Debugging untuk cek class "active" tertinggal
window.addEventListener('DOMContentLoaded', () => {
    console.log('Nav state on load:', mainNav?.classList.contains('active'));
});

document.addEventListener("DOMContentLoaded", () => {
    // ⚠️ Pastikan file bahasa sudah diload
    if (!window.langID || !window.langEN || !window.langJP) {
        console.error("Language files not loaded!");
        return;
    }

    let currentLang = 'en';
    const commandSets = { id: langID.commands, en: langEN.commands };
    const langData = { id: langID.texts, en: langEN.texts, jp: langJP.texts };

    // --- DOM Elements ---
    const commandInput = document.getElementById('command-input');
    const outputContainer = document.getElementById('output-container');
    const langSwitcher = document.getElementById('lang-switcher');
    const modal = document.getElementById('terminal-modal');
    const terminalBtn = document.getElementById('terminal-btn');
    const closeTerminalBtn = document.getElementById('close-terminal');
    const certBtn = document.getElementById('certBtn');
    const projBtn = document.getElementById('projBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    const isMobileView = () => window.innerWidth <= 768;

    // =======================================================
    // I. Render Bahasa
    // =======================================================
    function renderLang(lang) {
        const data = langData[lang];

        document.getElementById('hello-title').innerHTML = data.helloTitle;
        document.getElementById('hello-text').innerHTML = data.helloText;
        document.getElementById('skills-title').innerHTML = data.skillsTitle;
        document.getElementById('skills-list').innerHTML = data.skillsList;
        document.getElementById('projects-title').innerHTML = data.projectsTitle;
        document.getElementById('projects-desc').innerHTML = data.projectsDesc;
        document.getElementById('contact-title').innerHTML = data.contactTitle;

        // Tombol navigasi
        if (downloadBtn) downloadBtn.innerHTML = (lang === 'id') ? "Unduh CV" : (lang === 'en') ? "Download Resume" : "履歴書をダウンロード";
        if (certBtn) certBtn.innerHTML = (lang === 'id') ? "Sertifikat" : (lang === 'en') ? "Certificates" : "認定証";
        if (projBtn) projBtn.innerHTML = (lang === 'id') ? "Kegiatan" : (lang === 'en') ? "Activity" : "活動";

        // Terminal
        outputContainer.innerHTML = "";
        document.getElementById('terminal-welcome').innerHTML = `<span class="prompt">visitor@portfolio:~$</span> ${data.terminalWelcome}`;
        document.getElementById('terminal-help').innerHTML = data.terminalHelp;

        // Overlay JP
        const jpOverlay = document.getElementById('jp-locked');
        const terminalBox = document.getElementById('terminal-box');
        if (lang === 'jp') {
            if (jpOverlay) jpOverlay.style.display = 'flex';
            if (terminalBox) terminalBox.style.display = 'none';
        } else {
            if (jpOverlay) jpOverlay.style.display = 'none';
            if (terminalBox) terminalBox.style.display = 'block';
        }
    }

    // =======================================================
    // II. Burger Menu Logic
    // =======================================================
    if (burgerBtn && mainNav) {
        const toggleMenu = () => {
            const isActive = mainNav.classList.toggle('active');
            document.body.classList.toggle('menu-active', isActive);
            burgerBtn.innerHTML = isActive ? '✕' : '☰';
        };

        burgerBtn.addEventListener('click', toggleMenu);

        // Tutup menu saat item diklik (mobile)
        mainNav.querySelectorAll('button, select').forEach(item => {
            item.addEventListener('click', () => {
                if (isMobileView()) {
                    mainNav.classList.remove('active');
                    document.body.classList.remove('menu-active');
                    burgerBtn.innerHTML = '☰';
                }
            });
        });

        // Tutup menu saat membuka terminal (mobile)
        if (terminalBtn) {
            terminalBtn.addEventListener('click', () => {
                if (isMobileView() && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    document.body.classList.remove('menu-active');
                    burgerBtn.innerHTML = '☰';
                }
            });
        }
    }

    // =======================================================
    // III. Bahasa Switcher
    // =======================================================
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
        const lang = navigator.language || navigator.userLanguage;
        if (lang.startsWith("id")) return "id";
        if (lang.startsWith("en")) return "en";
        if (lang.startsWith("ja")) return "jp";
        return "en";
    };

    const initialLang = detectBrowserLang();
    if (langSwitcher) langSwitcher.value = initialLang;
    currentLang = initialLang;
    renderLang(initialLang);

    // =======================================================
    // IV. Terminal Logic
    // =======================================================
    function runCommand(cmd) {
        if (cmd === 'clear') {
            outputContainer.innerHTML = '';
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

    // Terminal modal
    if (terminalBtn && closeTerminalBtn && modal) {
        terminalBtn.onclick = () => modal.style.display = 'flex';
        closeTerminalBtn.onclick = () => modal.style.display = 'none';
        window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
    }

    // =======================================================
    // V. Navigasi & Download
    // =======================================================
    if (certBtn) certBtn.addEventListener('click', () => { window.location.href = "sertifikat.html"; });
    if (projBtn) projBtn.addEventListener('click', () => { window.location.href = "projects/projects.html"; });

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            let filePath = (currentLang === 'id') ? 'cv/cv.pdf' : 'cv/resume.pdf';
            const link = document.createElement('a');
            link.href = filePath;
            link.download = filePath.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // ✅ Tambahkan class untuk mencegah FOUC (Flash of Unstyled Content)
    document.body.classList.add('js-loaded');
});
