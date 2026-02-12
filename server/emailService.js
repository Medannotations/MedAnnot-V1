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
      background: linear-gradient(135deg, #0891b2 0%, #14b8a6 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #ffffff;
      margin: 0;
      letter-spacing: -0.5px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .logo-subtitle {
      color: rgba(255, 255, 255, 0.95);
      font-size: 14px;
      margin-top: 8px;
      font-weight: 500;
    }
    .content {
      padding: 40px 30px;
      color: #333333;
    }
    .content h1 {
      color: #0891b2;
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
      background: linear-gradient(135deg, #0891b2 0%, #14b8a6 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 24px 0;
      box-shadow: 0 4px 6px rgba(8, 145, 178, 0.2);
    }
    .info-box {
      background-color: #f0fdfa;
      border-left: 4px solid #14b8a6;
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
      background: linear-gradient(135deg, #0891b2 0%, #14b8a6 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      margin-right: 12px;
      flex-shrink: 0;
      box-shadow: 0 2px 4px rgba(8, 145, 178, 0.2);
    }
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      color: #777777;
      font-size: 13px;
    }
    .footer a {
      color: #0891b2;
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
      <p><strong>MedAnnot</strong> - Annotations médicales intelligentes par IA</p>
      <p>
        <a href="https://medannot.ch">Site web</a> |
        <a href="mailto:contact.medannot@gmail.com">Contactez-nous</a>
      </p>
      <p style="margin-top: 20px; font-size: 12px; color: #999;">
        Cet email a été envoyé automatiquement. Pour toute question, répondez à <a href="mailto:contact.medannot@gmail.com" style="color: #0891b2;">contact.medannot@gmail.com</a>
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
    <h1>Bienvenue sur MedAnnot ! 🎉</h1>
    <p>Bonjour <strong>${fullName}</strong>,</p>
    <p>Félicitations ! Votre compte MedAnnot a été créé avec succès. Vous faites désormais partie d'une communauté de professionnels de santé qui transforment leurs consultations en annotations structurées grâce à l'intelligence artificielle.</p>

    <div class="info-box">
      <p><strong>✅ Votre compte est prêt</strong></p>
      <p>Connectez-vous dès maintenant et commencez à gagner du temps sur vos annotations médicales.</p>
    </div>

    <a href="https://medannot.ch" class="button">Accéder à mon compte</a>

    <div class="divider"></div>

    <h2 style="color: #0891b2; font-size: 20px;">🚀 Premiers pas avec MedAnnot</h2>
    <div class="features">
      <div class="feature-item">
        <div class="feature-icon">1</div>
        <div>
          <strong>Configurez votre structure d'annotation</strong><br>
          <span style="color: #777; font-size: 14px;">Choisissez parmi nos modèles (LAMal, OPAS) ou créez le vôtre</span>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-icon">2</div>
        <div>
          <strong>Ajoutez vos patients</strong><br>
          <span style="color: #777; font-size: 14px;">Créez les dossiers pour une meilleure organisation</span>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-icon">3</div>
        <div>
          <strong>Dictez ou transcrivez vos consultations</strong><br>
          <span style="color: #777; font-size: 14px;">Utilisez l'enregistrement vocal ou la saisie manuelle</span>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-icon">4</div>
        <div>
          <strong>Laissez l'IA générer l'annotation</strong><br>
          <span style="color: #777; font-size: 14px;">Annotations structurées et professionnelles en un clic</span>
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <h2 style="color: #0891b2; font-size: 20px;">🔒 Sécurité et conformité</h2>
    <p>La confidentialité de vos données médicales est notre priorité absolue. MedAnnot respecte les standards les plus stricts de sécurité et de conformité.</p>

    <div class="info-box" style="border-left-color: #10b981; background-color: #f0fdf4;">
      <p style="margin: 8px 0;"><strong>✓ Hébergement Suisse</strong> - Conformité totale avec la législation suisse sur les données de santé</p>
      <p style="margin: 8px 0;"><strong>✓ Chiffrement de bout en bout</strong> - Toutes vos données sont cryptées (AES-256)</p>
      <p style="margin: 8px 0;"><strong>✓ Anonymisation IA</strong> - Les données sensibles sont anonymisées avant traitement</p>
    </div>

    <div class="divider"></div>

    <p>Des questions ? Notre équipe est là pour vous accompagner. Contactez-nous à <a href="mailto:contact.medannot@gmail.com" style="color: #0891b2; text-decoration: none;">contact.medannot@gmail.com</a></p>

    <p style="margin-top: 32px;">Excellente journée,</p>
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
    <p>Nous avons reçu une demande de réinitialisation du mot de passe de votre compte MedAnnot.</p>

    <div class="info-box" style="border-left-color: #f59e0b; background-color: #fffbeb;">
      <p><strong>⚠️ Action requise</strong></p>
      <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe sécurisé. Ce lien est valide pendant <strong>1 heure</strong> uniquement.</p>
    </div>

    <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>

    <p style="margin-top: 24px; font-size: 14px; color: #777;">
      Le bouton ne fonctionne pas ? Copiez et collez ce lien dans votre navigateur :<br>
      <a href="${resetUrl}" style="color: #0891b2; word-break: break-all;">${resetUrl}</a>
    </p>

    <div class="divider"></div>

    <div class="info-box" style="border-left-color: #ef4444; background-color: #fef2f2;">
      <p><strong>🔒 Note de sécurité</strong></p>
      <p style="margin: 8px 0;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité. Votre mot de passe actuel restera inchangé.</p>
      <p style="margin: 8px 0;">En cas d'activité suspecte, contactez-nous immédiatement à <a href="mailto:contact.medannot@gmail.com" style="color: #ef4444;">contact.medannot@gmail.com</a></p>
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
    <h1>✅ Mot de passe modifié avec succès</h1>
    <p>Bonjour <strong>${fullName}</strong>,</p>
    <p>Votre mot de passe MedAnnot a été modifié avec succès. Vous pouvez dès maintenant vous connecter avec votre nouveau mot de passe.</p>

    <div class="info-box" style="border-left-color: #10b981; background-color: #f0fdf4;">
      <p><strong>✅ Changement effectué</strong></p>
      <p>Date et heure : ${new Date().toLocaleString('fr-CH', { timeZone: 'Europe/Zurich', dateStyle: 'full', timeStyle: 'short' })}</p>
    </div>

    <a href="https://medannot.ch" class="button">Se connecter maintenant</a>

    <div class="divider"></div>

    <div class="info-box" style="border-left-color: #ef4444; background-color: #fef2f2;">
      <p><strong>⚠️ Vous ne reconnaissez pas cette action ?</strong></p>
      <p>Si vous n'avez pas modifié votre mot de passe, votre compte pourrait être compromis. Contactez-nous <strong>immédiatement</strong> à <a href="mailto:contact.medannot@gmail.com" style="color: #ef4444;">contact.medannot@gmail.com</a></p>
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

// Email de code d'accès admin (2FA)
const sendAdminAccessCode = async (email, code) => {
  const content = `
    <div style="text-align: center; padding: 20px 0;">
      <div style="background: linear-gradient(135deg, #ef4444, #dc2626); display: inline-block; padding: 8px 20px; border-radius: 20px; margin-bottom: 20px;">
        <span style="color: white; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Acces Admin</span>
      </div>
    </div>

    <h2 style="color: #1e293b; font-size: 22px; text-align: center; margin-bottom: 10px;">
      Code de verification admin
    </h2>

    <p style="color: #64748b; text-align: center; margin-bottom: 30px;">
      Une demande d'acces au panneau d'administration MedAnnot a ete effectuee.
    </p>

    <div style="background: #f1f5f9; border-radius: 12px; padding: 30px; text-align: center; margin: 0 auto 30px; max-width: 300px;">
      <p style="color: #64748b; font-size: 12px; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 1px;">Votre code</p>
      <div style="font-size: 36px; font-weight: 700; color: #0f172a; letter-spacing: 8px; font-family: monospace;">
        ${code}
      </div>
      <p style="color: #94a3b8; font-size: 12px; margin: 10px 0 0;">Expire dans 10 minutes</p>
    </div>

    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
      <p style="color: #991b1b; font-size: 13px; margin: 0;">
        <strong>Si vous n'avez pas demande ce code</strong>, quelqu'un tente d'acceder a votre panneau admin.
        Changez immediatement votre mot de passe.
      </p>
    </div>
  `;

  const mailOptions = {
    from: `"MedAnnot Admin" <${process.env.SMTP_FROM || 'noreply@medannot.ch'}>`,
    to: email,
    subject: `🔐 Code admin MedAnnot : ${code}`,
    html: getEmailTemplate(content, 'Acces Admin'),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email code admin envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur envoi email code admin:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendAdminAccessCode,
  transporter,
};
