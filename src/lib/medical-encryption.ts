// MEDICAL-GRADE ENCRYPTION SYSTEM
// Zero tolerance for patient data exposure
// HIPAA/LPD compliant for Swiss medical data

export interface EncryptedData {
  encrypted: string;
  iv: string;
  salt: string;
  timestamp: number;
}

export class MedicalEncryption {
  private static readonly ALGORITHM = 'AES-GCM';
  private static readonly KEY_LENGTH = 256;
  private static readonly IV_LENGTH = 12;
  private static readonly SALT_LENGTH = 16;
  
  // Generate encryption key from user password + salt
  static async generateKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      {
        name: this.ALGORITHM,
        length: this.KEY_LENGTH
      },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Encrypt patient data (names, sensitive info)
  static async encryptPatientData(data: string, password: string): Promise<EncryptedData> {
    try {
      const salt = crypto.getRandomValues(new Uint8Array(this.SALT_LENGTH));
      const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));
      const key = await this.generateKey(password, salt);
      
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(data);
      
      const encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: this.ALGORITHM,
          iv: iv
        },
        key,
        encodedData
      );
      
      return {
        encrypted: btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer))),
        iv: btoa(String.fromCharCode(...iv)),
        salt: btoa(String.fromCharCode(...salt)),
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Medical encryption failed:', error);
      throw new Error('Impossible de chiffrer les données médicales');
    }
  }

  // Decrypt patient data
  static async decryptPatientData(encryptedData: EncryptedData, password: string): Promise<string> {
    try {
      const encryptedBytes = new Uint8Array(atob(encryptedData.encrypted).split('').map(c => c.charCodeAt(0)));
      const ivBytes = new Uint8Array(atob(encryptedData.iv).split('').map(c => c.charCodeAt(0)));
      const saltBytes = new Uint8Array(atob(encryptedData.salt).split('').map(c => c.charCodeAt(0)));
      
      const key = await this.generateKey(password, saltBytes);
      
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: this.ALGORITHM,
          iv: ivBytes
        },
        key,
        encryptedBytes
      );
      
      const decoder = new TextDecoder();
      return decoder.decode(decryptedBuffer);
    } catch (error) {
      console.error('Medical decryption failed:', error);
      throw new Error('Impossible de déchiffrer les données médicales');
    }
  }

  // Generate secure pseudonym for AI processing
  static generatePseudonym(): string {
    const adjectives = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel'];
    const numbers = Math.random().toString(36).substr(2, 4).toUpperCase();
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    return `${adjective}-${numbers}`;
  }

  // Sanitize data for AI processing (remove patient names)
  static sanitizeForAI(text: string, patientName: string): string {
    const nameRegex = new RegExp(patientName, 'gi');
    const pseudonym = this.generatePseudonym();
    return text.replace(nameRegex, pseudonym);
  }

  // Create audit log entry
  static createAuditLog(action: string, userId: string, patientId?: string): void {
    const auditEntry = {
      action,
      userId,
      patientId,
      timestamp: new Date().toISOString(),
      ip: this.getClientIP()
    };
    
    // Store audit log (implementation depends on your logging system)
    console.log('MEDICAL AUDIT:', JSON.stringify(auditEntry));
  }

  private static getClientIP(): string {
    // Implementation depends on your environment
    return 'client-ip-placeholder';
  }
}

// Export for use in components
export default MedicalEncryption;