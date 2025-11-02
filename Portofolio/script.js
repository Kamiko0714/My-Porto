document.getElementById('downloadBtn').addEventListener('click', function() {
  const link = document.createElement('a');
  link.href = 'Portofolio\CV\CV.pdf';
  link.download = 'Kamiko-CV.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
