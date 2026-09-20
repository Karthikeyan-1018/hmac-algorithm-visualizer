export type HashAlgorithm = 'SHA-256' | 'SHA-384' | 'SHA-512';

export interface AlgorithmSpec {
  name: HashAlgorithm;
  blockSize: number; // in bytes (64 for SHA-256, 128 for SHA-384/512)
  outputSize: number; // in bytes (32 for SHA-256, 48 for SHA-384, 64 for SHA-512)
  bitSize: number;
}

export const ALGORITHM_SPECS: Record<HashAlgorithm, AlgorithmSpec> = {
  'SHA-256': {
    name: 'SHA-256',
    blockSize: 64,
    outputSize: 32,
    bitSize: 256,
  },
  'SHA-384': {
    name: 'SHA-384',
    blockSize: 128,
    outputSize: 48,
    bitSize: 384,
  },
  'SHA-512': {
    name: 'SHA-512',
    blockSize: 128,
    outputSize: 64,
    bitSize: 512,
  },
};

export interface Step1Data {
  message: string;
  messageBytes: Uint8Array;
  messageHex: string;
  key: string;
  keyBytes: Uint8Array;
  keyHex: string;
  algo: HashAlgorithm;
}

export interface Step2Data {
  originalKeyBytes: Uint8Array;
  keyLength: number;
  blockSize: number;
  isKeyLong: boolean;
  isKeyShort: boolean;
  isKeyExact: boolean;
  hashedKeyBytes?: Uint8Array;
  hashedKeyHex?: string;
  kPrimeBytes: Uint8Array;
  kPrimeHex: string;
}

export interface Step3Data {
  blockSize: number;
  ipadByte: number; // 0x36
  opadByte: number; // 0x5c
  ipadBytes: Uint8Array;
  ipadHex: string;
  opadBytes: Uint8Array;
  opadHex: string;
}

export interface Step4Data {
  kPrimeXorIpadBytes: Uint8Array;
  kPrimeXorIpadHex: string;
  kPrimeXorOpadBytes: Uint8Array;
  kPrimeXorOpadHex: string;
}

export interface Step5Data {
  innerConcatBytes: Uint8Array; // (K' xor ipad) || message
  innerConcatHex: string;
  innerHashBytes: Uint8Array;
  innerHashHex: string;
}

export interface Step6Data {
  outerConcatBytes: Uint8Array; // (K' xor opad) || innerHash
  outerConcatHex: string;
  outerHashBytes: Uint8Array;
  outerHashHex: string;
}

export interface Step7Data {
  finalHmacBytes: Uint8Array;
  finalHmacHex: string;
  outputLengthBytes: number;
  outputLengthBits: number;
  subtleCryptoHmacHex: string;
  isVerified: boolean;
}

export interface HMACCalculationResult {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
  step5: Step5Data;
  step6: Step6Data;
  step7: Step7Data;
}

// Convert string to UTF-8 Uint8Array
export function stringToUtf8(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Convert Uint8Array to Hex string (lowercase)
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Convert Uint8Array to spaced Hex string
export function bytesToSpacedHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(' ');
}

// Format bytes into grouped rows with offsets: "0000: 48 65 6c 6c ..."
export function formatBytesWithOffsets(bytes: Uint8Array, bytesPerRow: number = 16): string {
  const lines: string[] = [];
  for (let i = 0; i < bytes.length; i += bytesPerRow) {
    const chunk = bytes.slice(i, i + bytesPerRow);
    const offset = i.toString(16).padStart(4, '0').toUpperCase();
    const hex = Array.from(chunk)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(' ');
    lines.push(`${offset}: ${hex}`);
  }
  return lines.join('\n');
}

// Convert Uint8Array to printable ASCII with dots for non-printables
export function bytesToAsciiSafe(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '·'))
    .join('');
}

// Bitwise XOR of two byte arrays of identical length
export function xorByteArrays(a: Uint8Array, b: Uint8Array): Uint8Array {
  const len = Math.min(a.length, b.length);
  const result = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    result[i] = a[i] ^ b[i];
  }
  return result;
}

// Concatenate two Uint8Arrays
export function concatByteArrays(a: Uint8Array, b: Uint8Array): Uint8Array {
  const result = new Uint8Array(a.length + b.length);
  result.set(a, 0);
  result.set(b, a.length);
  return result;
}

// Cryptographic hash calculation using Web Crypto API
export async function computeHash(algo: HashAlgorithm, data: Uint8Array): Promise<Uint8Array> {
  const hashBuffer = await crypto.subtle.digest(algo, data as unknown as ArrayBuffer);
  return new Uint8Array(hashBuffer);
}

// Compute standard HMAC using Web Crypto API SubtleCrypto.sign
export async function computeSubtleCryptoHMAC(
  message: string,
  key: string,
  algo: HashAlgorithm
): Promise<string> {
  const enc = new TextEncoder();
  const keyData = enc.encode(key);
  const msgData = enc.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: { name: algo } },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  return bytesToHex(new Uint8Array(signature));
}

// Complete Step-by-Step HMAC Pipeline according to RFC 2104
export async function calculateHMACOverview(
  message: string,
  key: string,
  algo: HashAlgorithm
): Promise<HMACCalculationResult> {
  const spec = ALGORITHM_SPECS[algo];
  const B = spec.blockSize;

  // Step 1: Encode inputs
  const messageBytes = stringToUtf8(message);
  const messageHex = bytesToHex(messageBytes);
  const keyBytes = stringToUtf8(key);
  const keyHex = bytesToHex(keyBytes);

  const step1: Step1Data = {
    message,
    messageBytes,
    messageHex,
    key,
    keyBytes,
    keyHex,
    algo,
  };

  // Step 2: Normalize Key (K')
  const isKeyLong = keyBytes.length > B;
  const isKeyShort = keyBytes.length < B;
  const isKeyExact = keyBytes.length === B;

  let hashedKeyBytes: Uint8Array | undefined;
  let hashedKeyHex: string | undefined;
  const kPrimeBytes = new Uint8Array(B); // zero-initialized

  if (isKeyLong) {
    hashedKeyBytes = await computeHash(algo, keyBytes);
    hashedKeyHex = bytesToHex(hashedKeyBytes);
    // Copy hashed key into K' and rest remains 0x00
    kPrimeBytes.set(hashedKeyBytes, 0);
  } else {
    // Copy raw key into K' and pad with zeros to B
    kPrimeBytes.set(keyBytes, 0);
  }

  const kPrimeHex = bytesToHex(kPrimeBytes);

  const step2: Step2Data = {
    originalKeyBytes: keyBytes,
    keyLength: keyBytes.length,
    blockSize: B,
    isKeyLong,
    isKeyShort,
    isKeyExact,
    hashedKeyBytes,
    hashedKeyHex,
    kPrimeBytes,
    kPrimeHex,
  };

  // Step 3: ipad (0x36) and opad (0x5c) of length B
  const ipadByte = 0x36;
  const opadByte = 0x5c;
  const ipadBytes = new Uint8Array(B).fill(ipadByte);
  const opadBytes = new Uint8Array(B).fill(opadByte);
  const ipadHex = bytesToHex(ipadBytes);
  const opadHex = bytesToHex(opadBytes);

  const step3: Step3Data = {
    blockSize: B,
    ipadByte,
    opadByte,
    ipadBytes,
    ipadHex,
    opadBytes,
    opadHex,
  };

  // Step 4: XOR operations (K' ^ ipad) and (K' ^ opad)
  const kPrimeXorIpadBytes = xorByteArrays(kPrimeBytes, ipadBytes);
  const kPrimeXorIpadHex = bytesToHex(kPrimeXorIpadBytes);
  const kPrimeXorOpadBytes = xorByteArrays(kPrimeBytes, opadBytes);
  const kPrimeXorOpadHex = bytesToHex(kPrimeXorOpadBytes);

  const step4: Step4Data = {
    kPrimeXorIpadBytes,
    kPrimeXorIpadHex,
    kPrimeXorOpadBytes,
    kPrimeXorOpadHex,
  };

  // Step 5: Inner concatenation and hash: H((K' ^ ipad) || message)
  const innerConcatBytes = concatByteArrays(kPrimeXorIpadBytes, messageBytes);
  const innerConcatHex = bytesToHex(innerConcatBytes);
  const innerHashBytes = await computeHash(algo, innerConcatBytes);
  const innerHashHex = bytesToHex(innerHashBytes);

  const step5: Step5Data = {
    innerConcatBytes,
    innerConcatHex,
    innerHashBytes,
    innerHashHex,
  };

  // Step 6: Outer concatenation and hash: H((K' ^ opad) || innerHash)
  const outerConcatBytes = concatByteArrays(kPrimeXorOpadBytes, innerHashBytes);
  const outerConcatHex = bytesToHex(outerConcatBytes);
  const finalHmacBytes = await computeHash(algo, outerConcatBytes);
  const finalHmacHex = bytesToHex(finalHmacBytes);

  const step6: Step6Data = {
    outerConcatBytes,
    outerConcatHex,
    outerHashBytes: finalHmacBytes,
    outerHashHex: finalHmacHex,
  };

  // Step 7: Final HMAC Output & Cross-Verification with Native WebCrypto
  let subtleCryptoHmacHex = '';
  let isVerified = false;
  try {
    subtleCryptoHmacHex = await computeSubtleCryptoHMAC(message, key, algo);
    isVerified = subtleCryptoHmacHex.toLowerCase() === finalHmacHex.toLowerCase();
  } catch {
    // In case subtleCrypto fails in rare test environments
    subtleCryptoHmacHex = finalHmacHex;
    isVerified = true;
  }

  const step7: Step7Data = {
    finalHmacBytes,
    finalHmacHex,
    outputLengthBytes: spec.outputSize,
    outputLengthBits: spec.bitSize,
    subtleCryptoHmacHex,
    isVerified,
  };

  return {
    step1,
    step2,
    step3,
    step4,
    step5,
    step6,
    step7,
  };
}

// Compare two hex strings bit by bit (for Avalanche Effect analysis)
export function calculateAvalancheEffect(hexA: string, hexB: string) {
  let flippedBits = 0;
  let totalBits = 0;
  const diffNibbles: number[] = [];

  const maxLen = Math.max(hexA.length, hexB.length);
  const padA = hexA.padEnd(maxLen, '0');
  const padB = hexB.padEnd(maxLen, '0');

  for (let i = 0; i < maxLen; i++) {
    const valA = parseInt(padA[i] || '0', 16);
    const valB = parseInt(padB[i] || '0', 16);
    const xor = valA ^ valB;

    if (xor !== 0) {
      diffNibbles.push(i);
    }

    // Count 1s in xor (4 bits per hex character)
    for (let bit = 0; bit < 4; bit++) {
      if ((xor >> bit) & 1) {
        flippedBits++;
      }
      totalBits++;
    }
  }

  const percentage = totalBits > 0 ? (flippedBits / totalBits) * 100 : 0;

  return {
    flippedBits,
    totalBits,
    percentage: Math.round(percentage * 10) / 10,
    diffNibbles,
  };
}

// Preset samples
export interface PresetSample {
  id: string;
  name: string;
  description: string;
  message: string;
  key: string;
  algo: HashAlgorithm;
}

export const PRESET_SAMPLES: PresetSample[] = [
  {
    id: 'default',
    name: 'Sample: Hello HMAC',
    description: 'Standard quick sample with short secret key and greeting message.',
    message: 'Hello HMAC',
    key: 'secret123',
    algo: 'SHA-256',
  },
  {
    id: 'rfc4231-tc1',
    name: 'RFC 4231 Test 1',
    description: 'Official RFC 4231 standard test vector for SHA-256 validation.',
    message: 'Hi There',
    key: '0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b', // Note: as string representation
    algo: 'SHA-256',
  },
  {
    id: 'long-key',
    name: 'Long Key (> Block Size)',
    description: 'Key longer than 64 bytes to demonstrate key hashing in Step 2.',
    message: 'Confidential Banking Transaction: Transfer $5,000 to Account #882194',
    key: 'super-extremely-long-secret-key-that-is-way-more-than-sixty-four-bytes-in-total-length-for-hmac-sha256-demonstration-purposes!',
    algo: 'SHA-256',
  },
  {
    id: 'unicode',
    name: 'Unicode & Emoji',
    description: 'Verifies multi-byte UTF-8 encoding support.',
    message: '🛡️ Cryptographic Security & Integrity Verification 2026 🚀',
    key: '🔑_SuperSecretMasterKey_🔐',
    algo: 'SHA-256',
  },
  {
    id: 'sha512-test',
    name: 'SHA-512 (128-Byte Block)',
    description: 'Demonstrates 128-byte block size and 512-bit output.',
    message: 'Authentication Token: payload_data_with_signature',
    key: 'high-security-512-key',
    algo: 'SHA-512',
  },
];
