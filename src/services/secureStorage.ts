/**
 * Service de stockage sécurisé du mot de passe en mémoire
 * Le mot de passe est utilisé pour dériver la clé de chiffrement
 * et n'est jamais envoyé au serveur ni stocké sur disque
 */

// Stockage en mémoire volatile (effacé au refresh)
let encryptionPassword: string | null = null;

/**
 * Stocke le mot de passe en mémoire pour la session
 */
export function setEncryptionPassword(password: string): void {
  encryptionPassword = password;
}

/**
 * Récupère le mot de passe depuis la mémoire
 */
export function getEncryptionPassword(): string | null {
  return encryptionPassword;
}

/**
 * Efface le mot de passe de la mémoire
 */
export function clearEncryptionPassword(): void {
  encryptionPassword = null;
}

/**
 * Vérifie si un mot de passe est disponible
 */
export function hasEncryptionPassword(): boolean {
  return encryptionPassword !== null && encryptionPassword.length > 0;
}
