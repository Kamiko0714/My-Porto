// js/main.js

document.addEventListener("DOMContentLoaded", () => {
    // ⚠️ Pengecekan file bahasa
    if (!window.langID || !window.langEN || !window.langJP) {
        console.error("Language files not loaded!");
        return;
    }

    let currentLang = 'en';
    const commandSets = { id: langID.commands, en: langEN.commands };
    const langData = { id: langID.texts, en: langEN.texts, jp: langJP.texts };

    // --- Elemen DOM Utama ---
    const commandInput = document.getElementById('command-input');
    const outputContainer = document.getElementById('output-container');
    const langSwitcher = document.getElementById('lang-switcher');
    const modal = document.getElementById('terminal-modal');
    const terminalBtn = document.getElementById('terminal-btn');
    const closeTerminalBtn = document.getElementById('close-terminal');
    const certBtn = document.getElementById('certBtn');
    const projBtn = document.getElementById('projBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // --- Elemen Burger Menu BARU ---
    const burgerBtn = document.getElementById('burger-menu-btn');
    const mainNav = document.getElementById('main-nav');
    const isMobileView = () => window.innerWidth <= 768;


    // =======================================================
    // I. FUNGSI UTAMA RENDER BAHASA
    // =======================================================

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

        // Tombol Navigasi
        if (downloadBtn) {
            if (lang === 'id') downloadBtn.innerHTML = "Unduh CV";
            else if (lang === 'en') downloadBtn.innerHTML = "Download Resume";
            else if (lang === 'jp') downloadBtn.innerHTML = "履歴書をダウンロード";
        }

        if (certBtn) {
            if (lang === 'id') certBtn.innerHTML = "Sertifikat";
            else if (lang === 'en') certBtn.innerHTML = "Certificates";
            else if (lang === 'jp') certBtn.innerHTML = "認定証";
        }

        if (projBtn) {
            if (lang === 'id') projBtn.innerHTML = "Kegiatan";
            else if (lang === 'en') projBtn.innerHTML = "Activity";
            else if (lang === 'jp') projBtn.innerHTML = "活動";
        }

        // Terminal
        outputContainer.innerHTML = ""; // Reset terminal
        document.getElementById('terminal-welcome').innerHTML =
            `<span class="prompt">visitor@portfolio:~$</span> ${data.terminalWelcome}`;
        document.getElementById('terminal-help').innerHTML = data.terminalHelp;

        // Kunci Terminal JP
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
    // II. LOGIKA BURGER MENU (BARU)
    // =======================================================

    // Burger menu toggle
    if (burgerBtn && mainNav) {
        burgerBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');

            // Tambahkan/remove class menu-active di body
            document.body.classList.toggle('menu-active', mainNav.classList.contains('active'));

            // Ubah ikon burger
            burgerBtn.innerHTML = mainNav.classList.contains('active') ? '✕' : '☰';
        });

        // Tutup menu saat item diklik (mobile)
        const navItems = mainNav.querySelectorAll('button, select');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    mainNav.classList.remove('active');
                    document.body.classList.remove('menu-active');
                    burgerBtn.innerHTML = '☰';
                }
            });
        });

        
        // Tutup menu burger juga saat Terminal dibuka
        if (terminalBtn) {
            terminalBtn.addEventListener('click', () => {
                if (isMobileView() && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    burgerBtn.innerHTML = '☰';
                }
            });
        }
    }


    // =======================================================
    // III. LOGIKA GANTI BAHASA
    // =======================================================

    if (langSwitcher) {
        langSwitcher.addEventListener('change', (e) => {
            const lang = e.target.value;
            localStorage.setItem("preferredLang", lang);
            currentLang = lang;
            renderLang(lang);
        });
    }

    // Fungsi deteksi bahasa awal
    function detectBrowserLang() {
        const saved = localStorage.getItem("preferredLang");
        if (saved) return saved;

        const lang = navigator.language || navigator.userLanguage;
        if (lang.startsWith("id")) return "id";
        if (lang.startsWith("en")) return "en";
        if (lang.startsWith("ja")) return "jp";
        return "en";
    }

    // Set bahasa awal dan render
    const initialLang = detectBrowserLang();
    if (langSwitcher) langSwitcher.value = initialLang;
    currentLang = initialLang;
    renderLang(initialLang);


    // =======================================================
    // IV. LOGIKA TERMINAL
    // =======================================================

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

    if (commandInput && outputContainer) {
        commandInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = commandInput.value.trim();
                commandInput.value = '';
                
                // Tampilkan command yang diketik user
                const line = document.createElement('div');
                line.className = 'output';
                line.innerHTML = `<span class="prompt">visitor@portfolio:~$</span> ${cmd}`;
                outputContainer.appendChild(line);

                // Jalankan command dan tampilkan hasilnya
                const result = runCommand(cmd);
                if (result) {
                    const out = document.createElement('div');
                    out.className = 'output';
                    out.innerHTML = result;
                    outputContainer.appendChild(out);
                }

                // Scroll ke bawah
                outputContainer.scrollTop = outputContainer.scrollHeight;
            }
        });
    }

    // Modal terminal
    if (terminalBtn && closeTerminalBtn && modal) {
        terminalBtn.onclick = () => modal.style.display = 'flex';
        closeTerminalBtn.onclick = () => modal.style.display = 'none';
        window.onclick = (e) => { 
            if (e.target === modal) modal.style.display = 'none'; 
        }
    }


    // =======================================================
    // V. LOGIKA TOMBOL NAVIGASI & DOWNLOAD
    // =======================================================

    // Tombol Sertifikat
    if (certBtn) certBtn.addEventListener('click', () => {
        window.location.href = "sertifikat.html";
    });

    // Tombol Kegiatan/Project
    if (projBtn) projBtn.addEventListener('click', () => {
        window.location.href = "projects/projects.html";
    });

    // Tombol Download CV/Resume
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            let filePath = '';
            // Tentukan file CV berdasarkan bahasa saat ini
            if (currentLang === 'id') filePath = 'cv/cv.pdf';
            else if (currentLang === 'en') filePath = 'cv/resume.pdf';
            else if (currentLang === 'jp') filePath = 'cv/resume.pdf'; // Menggunakan English sebagai fallback untuk JP

            // Trigger download
            const link = document.createElement('a');
            link.href = filePath;
            link.download = filePath.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

});