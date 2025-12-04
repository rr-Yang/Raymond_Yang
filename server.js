// server.js  ────────────────────────────────────────────────
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const nodemailer = require('nodemailer');

const app = express();

/* middleware ------------------------------------------------*/
app.use(cors());               // ← lets requests come from file:// OR any origin
app.use(express.json());       // ← parses JSON bodies
app.use(express.static(__dirname)); // optional: serve contact.html over HTTP

/* POST /send-email ------------------------------------------*/
app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,  // Gmail address
        pass: process.env.SMTP_PASS   // 16-char **App Password**
      }
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.DESTINATION,
      subject: 'New message from portfolio site',
      text: message,
      html: `<p>${message.replace(/\n/g, '<br>')}</p>`
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('Send-mail error:', err);
    res.status(500).json({ error: err.message });  // <-- surfaces real cause
  }
});

/* boot ------------------------------------------------------*/
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`✓ API running → http://localhost:${PORT}`)
);
