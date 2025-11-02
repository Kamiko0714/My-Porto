document.getElementById('downloadBtn').addEventListener('click', function() {
  const lang = document.getElementById('lang-switcher').value;
  const link = document.createElement('a');

  link.style.display = 'none';
  if (lang === 'id') {
    link.href = 'https://kamiko0714.cyou/CV/CV.pdf';
  } else {
    link.href = 'https://kamiko0714.cyou/CV/Resume.pdf';
  }
  link.download = 'Kamiko-CV.pdf';

  document.body.appendChild(link);
  link.click();
  setTimeout(() => document.body.removeChild(link), 500);
});
