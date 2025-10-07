function setLanguage(lang) {
  let data;
  switch (lang) {
    case "id": data = window.lang_id; break;
    case "en": data = window.lang_en; break;
    case "jp": data = window.lang_jp; break;
    default: data = window.lang_en;
  }

  if (!data) {
    console.error("Data bahasa tidak ditemukan:", lang);
    return;
  }

  // Update bagian umum
  document.getElementById("page-title").textContent = data.pageTitle;
  document.getElementById("page-subtitle").textContent = data.pageSubtitle;
  document.getElementById("listTitle").textContent = data.listTitle;
  document.getElementById("backHome").textContent = data.backHome;

  // Update tiap proyek
  const titles = document.querySelectorAll(".proj-title");
  const descs = document.querySelectorAll(".proj-desc");

  if (data.projects && data.projects.length) {
    data.projects.forEach((proj, i) => {
      if (titles[i]) titles[i].textContent = proj.title;
      if (descs[i]) descs[i].textContent = proj.desc;
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const selector = document.getElementById("lang-switcher");
  const savedLang = localStorage.getItem("lang") || "id";

  selector.value = savedLang;
  setLanguage(savedLang);

  selector.addEventListener("change", e => {
    const lang = e.target.value;
    localStorage.setItem("lang", lang);
    setLanguage(lang);
  });
});
