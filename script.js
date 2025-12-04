/* ───────────────── Smooth scrolling for nav anchors ───────────────── */
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    document
      .querySelector(anchor.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  });
});

/* ───────────────── Contact-form logic ───────────────── */
const contactForm   = document.querySelector('form');
const statusBanner  = document.getElementById('statusMessage'); // add <div id="statusMessage"></div> in HTML
const submitButton  = contactForm.querySelector('button[type="submit"]');

/**
 * Helper to show banner messages (success / error)
 */
function showStatus(text, type = 'info') {
  statusBanner.textContent = text;
  statusBanner.className = `status-message ${type}`; // CSS: .success {…}, .error {…}
}

contactForm.addEventListener('submit', async e => {
  e.preventDefault();

  // gather form data
  const formData = {
    name   : contactForm.name.value.trim(),
    email  : contactForm.email.value.trim(),
    message: contactForm.message.value.trim()
  };

  // simple client-side validation
  if (!formData.name || !formData.email || !formData.message) {
    return showStatus('❌ Please fill in every field.', 'error');
  }

  /* UI: disable button + reset banner */
  submitButton.disabled = true;
  submitButton.textContent = 'Sending…';
  showStatus('');

  try {
    /* ★★★  CHANGE THIS URL IF NEEDED  ★★★
       - If you open the page via  http://localhost:4000/contact.html
         keep it as  '/send-email'
       - If you double-click the HTML (file://) OR your API runs on
         another port, write the full URL:
         'http://localhost:4000/send-email'
    */
    const res = await fetch('/send-email', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(formData)
    });

    const data = await res.json();

    if (res.ok) {
      showStatus('✅ Message sent successfully! I’ll get back to you soon.', 'success');
      contactForm.reset();
    } else {
      throw new Error(data.error || 'Server failed to send e-mail.');
    }
  }  finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Send Message';
  }
});
