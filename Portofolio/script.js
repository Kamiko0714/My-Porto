document.getElementById('downloadBtn').addEventListener('click', function() {
  const lang = document.getElementById('lang-switcher').value; 
  const link = document.createElement('a');

  if (lang === 'id') {
    link.href = '/CV/CV.pdf';
  } else if (lang === 'en') {
    link.href = '/CV/Resume.pdf';
  } else {
    link.href = '/CV/Resume.pdf';
  }

  link.download = 'Kamiko-CV.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
