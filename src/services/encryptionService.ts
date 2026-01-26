/**
 * Service de chiffrement pour les données patients
 * Conforme au secret médical et aux normes LPD suisse
 *
 * Utilise AES-256-GCM pour le chiffrement symétrique
 * Les données sont chiffrées côté client avant envoi à la base de données
 */

const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits recommandé pour GCM
const SALT_LENGTH = 16;
const ITERATIONS = 100000; // PBKDF2 iterations

/**
 * Génère une clé de chiffrement dérivée de l'ID utilisateur
 * Utilise PBKDF2 pour dériver une clé cryptographique forte
 */
async function deriveKey(userId: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(userId),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Chiffre une chaîne de caractères
 * @param plaintext - Texte en clair à chiffrer
 * @param userId - ID de l'utilisateur (utilisé pour dériver la clé)
 * @returns Base64 du format: salt + iv + ciphertext
 */
export async function encrypt(plaintext: string, userId: string): Promise<string> {
  if (!plaintext) return plaintext;

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    // Générer un salt aléatoire pour PBKDF2
    const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));

    // Générer un IV aléatoire
    const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    // Dériver la clé de chiffrement
    const key = await deriveKey(userId, salt);

    // Chiffrer les données
    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      key,
      data
    );

    // Combiner salt + iv + ciphertext
    const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(ciphertext), salt.length + iv.length);

    // Encoder en base64
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Erreur lors du chiffrement des données");
  }
}

/**
 * Vérifie si une chaîne est chiffrée (format base64 valide avec longueur minimale)
 */
function isEncrypted(data: string): boolean {
  if (!data || data.length < 32) return false;

  // Vérifier si c'est du base64 valide
  const base64Regex = /^[A-Za-z0-9+/]+=*$/;
  if (!base64Regex.test(data)) return false;

  try {
    atob(data);
    return true;
  } catch {
    return false;
  }
}

/**
 * Déchiffre une chaîne de caractères
 * @param encrypted - Données chiffrées en base64
 * @param userId - ID de l'utilisateur (utilisé pour dériver la clé)
 * @returns Texte en clair
 */
export async function decrypt(encrypted: string, userId: string): Promise<string> {
  if (!encrypted) return encrypted;

  // Si les données ne sont pas chiffrées, les retourner telles quelles (rétrocompatibilité)
  if (!isEncrypted(encrypted)) {
    return encrypted;
  }

  try {
    // Décoder le base64
    const combined = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));

    // Extraire salt, iv et ciphertext
    const salt = combined.slice(0, SALT_LENGTH);
    const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const ciphertext = combined.slice(SALT_LENGTH + IV_LENGTH);

    // Dériver la clé de déchiffrement
    const key = await deriveKey(userId, salt);

    // Déchiffrer les données
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      key,
      ciphertext
    );

    // Décoder en texte
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Erreur lors du déchiffrement des données");
  }
}

/**
 * Chiffre les données sensibles d'un patient
 */
export interface PatientData {
  first_name: string;
  last_name: string;
  address?: string;
  postal_code?: string;
  city?: string;
  pathologies: string;
  notes?: string;
}

export async function encryptPatientData(
  data: PatientData,
  userId: string
): Promise<PatientData> {
  return {
    first_name: await encrypt(data.first_name, userId),
    last_name: await encrypt(data.last_name, userId),
    address: data.address ? await encrypt(data.address, userId) : undefined,
    postal_code: data.postal_code ? await encrypt(data.postal_code, userId) : undefined,
    city: data.city ? await encrypt(data.city, userId) : undefined,
    pathologies: await encrypt(data.pathologies, userId),
    notes: data.notes ? await encrypt(data.notes, userId) : undefined,
  };
}

/**
 * Déchiffre les données sensibles d'un patient
 */
export async function decryptPatientData(
  data: PatientData,
  userId: string
): Promise<PatientData> {
  return {
    first_name: await decrypt(data.first_name, userId),
    last_name: await decrypt(data.last_name, userId),
    address: data.address ? await decrypt(data.address, userId) : undefined,
    postal_code: data.postal_code ? await decrypt(data.postal_code, userId) : undefined,
    city: data.city ? await decrypt(data.city, userId) : undefined,
    pathologies: await decrypt(data.pathologies, userId),
    notes: data.notes ? await decrypt(data.notes, userId) : undefined,
  };
}

/**
 * Génère un pseudonyme pour affichage (ex: "Patient #12345")
 * Utilisé pour l'affichage anonymisé dans les logs ou interfaces
 */
export function generatePseudonym(patientId: string): string {
  // Extraire les 6 derniers caractères de l'UUID
  const shortId = patientId.slice(-6).toUpperCase();
  return `Patient #${shortId}`;
}

/**
 * Hash une donnée pour la recherche pseudonymisée
 * Permet de rechercher sans révéler les données en clair
 */
export async function hashForSearch(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data.toLowerCase().trim());
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
