document.getElementById('downloadBtn').addEventListener('click', async function () {
  const lang = document.getElementById('lang-switcher').value;
  const fileUrl = lang === 'id'
    ? 'https://kamiko0714.cyou/CV/CV.pdf'
    : 'https://kamiko0714.cyou/CV/Resume.pdf';

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error('Network response was not ok');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'Kamiko-CV.pdf';
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 500);
  } catch (err) {
    console.error('Download failed:', err);
    alert('Gagal mengunduh file. Silakan coba lagi.');
  }
});
