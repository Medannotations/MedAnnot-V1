/**
 * Service d'envoi d'emails - MedAnnot
 * Utilise Nodemailer avec templates HTML professionnels
 */

const nodemailer = require('nodemailer');

// Configuration du transporteur SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Vérifier la configuration SMTP au démarrage
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Erreur configuration SMTP:', error.message);
  } else {
    console.log('✅ Serveur SMTP prêt pour l\'envoi d\'emails');
  }
});

// Template de base HTML avec design MedAnnot
const getEmailTemplate = (content, title = 'MedAnnot') => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
      line-height: 1.6;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #ffffff;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .logo-subtitle {
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      margin-top: 8px;
    }
    .content {
      padding: 40px 30px;
      color: #333333;
    }
    .content h1 {
      color: #667eea;
      font-size: 24px;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .content p {
      margin: 16px 0;
      color: #555555;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 24px 0;
      transition: transform 0.2s;
    }
    .button:hover {
      transform: translateY(-2px);
    }
    .info-box {
      background-color: #f8f9fa;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 24px 0;
      border-radius: 4px;
    }
    .info-box p {
      margin: 8px 0;
    }
    .features {
      margin: 32px 0;
    }
    .feature-item {
      display: flex;
      align-items: start;
      margin: 16px 0;
    }
    .feature-icon {
      width: 24px;
      height: 24px;
      background-color: #667eea;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      margin-right: 12px;
      flex-shrink: 0;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      color: #777777;
      font-size: 13px;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
    .divider {
      height: 1px;
      background: linear-gradient(to right, transparent, #e0e0e0, transparent);
      margin: 32px 0;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="logo">MedAnnot</h1>
      <p class="logo-subtitle">Annotations Médicales Intelligentes</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>MedAnnot - Annotations médicales par IA</p>
      <p>
        <a href="https://medannot.ch">medannot.ch</a> |
        <a href="https://medannot.ch/support">Support</a>
      </p>
      <p style="margin-top: 20px; font-size: 12px; color: #999;">
        Cet email a été envoyé automatiquement. Pour toute question, contactez-nous via notre site.
      </p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Email de bienvenue après inscription
 */
const sendWelcomeEmail = async (email, fullName) => {
  const content = `
    <h1>Bienvenue sur MedAnnot ! 👋</h1>
    <p>Bonjour <strong>${fullName}</strong>,</p>
    <p>Merci d'avoir rejoint MedAnnot. Votre compte a été créé avec succès et vous pouvez dès maintenant commencer à utiliser notre plateforme d'annotations médicales intelligentes.</p>

    <div class="info-box">
      <p><strong>✅ Votre compte est activé</strong></p>
      <p>Vous pouvez vous connecter immédiatement et commencer à créer vos premières annotations.</p>
    </div>

    <a href="https://medannot.ch/signup" class="button">Accéder à mon compte</a>

    <div class="divider"></div>

    <h2 style="color: #667eea; font-size: 20px;">🚀 Pour bien démarrer</h2>
    <div class="features">
      <div class="feature-item">
        <div class="feature-icon">1</div>
        <div>
          <strong>Ajoutez vos premiers patients</strong><br>
          <span style="color: #777; font-size: 14px;">Créez un dossier patient pour organiser vos annotations</span>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-icon">2</div>
        <div>
          <strong>Enregistrez vos notes vocales</strong><br>
          <span style="color: #777; font-size: 14px;">Utilisez le micro pour dicter vos observations</span>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-icon">3</div>
        <div>
          <strong>Générez vos annotations</strong><br>
          <span style="color: #777; font-size: 14px;">L'IA transforme vos notes en annotations professionnelles</span>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-icon">4</div>
        <div>
          <strong>Personnalisez vos templates</strong><br>
          <span style="color: #777; font-size: 14px;">Créez des phrases types pour gagner du temps</span>
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <h2 style="color: #667eea; font-size: 20px;">🔒 Sécurité et confidentialité</h2>
    <p>Vos données sont chiffrées de bout en bout et hébergées en Suisse. Nous prenons la confidentialité médicale très au sérieux.</p>

    <div class="info-box" style="border-left-color: #28a745; background-color: #f0f8f4;">
      <p style="margin: 0;"><strong>✓ Données chiffrées</strong> - AES-256</p>
      <p style="margin: 0;"><strong>✓ Hébergement Suisse</strong> - Conformité HIPAA</p>
      <p style="margin: 0;"><strong>✓ Accès sécurisé</strong> - Authentification renforcée</p>
    </div>

    <div class="divider"></div>

    <p>Besoin d'aide pour démarrer ? Connectez-vous et suivez le <a href="https://medannot.ch/app" style="color: #667eea; text-decoration: none;">guide de démarrage</a> sur votre tableau de bord, ou contactez-nous.</p>

    <p style="margin-top: 32px;">À bientôt sur MedAnnot !</p>
    <p><strong>L'équipe MedAnnot</strong></p>
  `;

  const mailOptions = {
    from: `"MedAnnot" <${process.env.SMTP_FROM || 'noreply@medannot.ch'}>`,
    to: email,
    subject: '🎉 Bienvenue sur MedAnnot - Votre compte est activé',
    html: getEmailTemplate(content, 'Bienvenue sur MedAnnot'),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de bienvenue envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur envoi email de bienvenue:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Email de réinitialisation de mot de passe
 */
const sendPasswordResetEmail = async (email, fullName, resetToken) => {
  const resetUrl = `https://medannot.ch/reset-password?token=${resetToken}`;

  const content = `
    <h1>Réinitialisation de votre mot de passe</h1>
    <p>Bonjour <strong>${fullName}</strong>,</p>
    <p>Vous avez demandé la réinitialisation de votre mot de passe MedAnnot.</p>

    <div class="info-box" style="border-left-color: #ffc107; background-color: #fff9e6;">
      <p><strong>⚠️ Action requise</strong></p>
      <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe. Ce lien est valide pendant <strong>1 heure</strong>.</p>
    </div>

    <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>

    <p style="margin-top: 24px; font-size: 14px; color: #777;">
      Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
      <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
    </p>

    <div class="divider"></div>

    <div class="info-box" style="border-left-color: #dc3545; background-color: #fff0f0;">
      <p><strong>🔒 Sécurité</strong></p>
      <p style="margin: 8px 0;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe actuel reste inchangé.</p>
      <p style="margin: 8px 0;">Pour toute question de sécurité, contactez-nous immédiatement.</p>
    </div>

    <p style="margin-top: 32px;">Cordialement,</p>
    <p><strong>L'équipe MedAnnot</strong></p>
  `;

  const mailOptions = {
    from: `"MedAnnot" <${process.env.SMTP_FROM || 'noreply@medannot.ch'}>`,
    to: email,
    subject: '🔐 Réinitialisation de votre mot de passe MedAnnot',
    html: getEmailTemplate(content, 'Réinitialisation mot de passe'),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de réinitialisation envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur envoi email de réinitialisation:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Email de confirmation de changement de mot de passe
 */
const sendPasswordChangedEmail = async (email, fullName) => {
  const content = `
    <h1>Mot de passe modifié avec succès</h1>
    <p>Bonjour <strong>${fullName}</strong>,</p>
    <p>Nous vous confirmons que votre mot de passe MedAnnot a été modifié avec succès.</p>

    <div class="info-box" style="border-left-color: #28a745; background-color: #f0f8f4;">
      <p><strong>✅ Changement confirmé</strong></p>
      <p>Date et heure : ${new Date().toLocaleString('fr-CH', { timeZone: 'Europe/Zurich' })}</p>
    </div>

    <a href="https://medannot.ch/login" class="button">Se connecter</a>

    <div class="divider"></div>

    <div class="info-box" style="border-left-color: #dc3545; background-color: #fff0f0;">
      <p><strong>⚠️ Activité suspecte ?</strong></p>
      <p>Si vous n'êtes pas à l'origine de ce changement, contactez-nous <strong>immédiatement</strong> pour sécuriser votre compte.</p>
    </div>

    <p style="margin-top: 32px;">Cordialement,</p>
    <p><strong>L'équipe MedAnnot</strong></p>
  `;

  const mailOptions = {
    from: `"MedAnnot" <${process.env.SMTP_FROM || 'noreply@medannot.ch'}>`,
    to: email,
    subject: '✅ Votre mot de passe a été modifié - MedAnnot',
    html: getEmailTemplate(content, 'Mot de passe modifié'),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de confirmation changement mot de passe envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur envoi email de confirmation:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  transporter,
};
