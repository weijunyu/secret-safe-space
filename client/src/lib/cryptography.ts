import * as sjcl from "sjcl";

/**
 * sjcl.encrypt and sjcl.decrypt actually return json strings of
 * raw cipher objects:
 * https://github.com/bitwiseshiftleft/sjcl/blob/master/core/convenience.js
 */

export function encrypt(plaintext: string, passphrase: string): string {
  return (sjcl.encrypt(passphrase, plaintext, {
    salt: sjcl.random.randomWords(4), // 1 word = 32 bits/4 bytes.
    iv: sjcl.random.randomWords(3), // iv should be 96 bits: https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams
    mode: "gcm",
  }) as unknown) as string;
}

export function decrypt(ciphertext: string, passphrase: string): string {
  return sjcl.decrypt(passphrase, ciphertext);
}

export function getCiphertextFromCipher(cipher: string): string {
  return JSON.parse(cipher).ct;
}
