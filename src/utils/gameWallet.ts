import { Keypair } from "@solana/web3.js";
import { enc, AES, lib } from "crypto-js";
import Utf8 from "crypto-js/enc-utf8";

const SECRET_PHRASE = enc.Base64.stringify(Utf8.parse("Kyogen Dominari Rules"));

const STORAGE_KEY = "kyogenGameWallet";

const base64ToArrayBuffer = (str: string) => Buffer.from(str, "base64");

/**
 * Checks if a game wallet exists in localStorage. If a wallet exists, it decrypts the key and
 * returns the Keypair. If no wallet exists, a new one is created, encrypted, and stored.
 */
export const loadOrCreateGameWallet = (): Keypair => {
  const encryptedSecretKey = window.localStorage.getItem(STORAGE_KEY);
  if (encryptedSecretKey) {
    const dcWordArray = AES.decrypt(encryptedSecretKey, SECRET_PHRASE);
    const dcBase64String = dcWordArray.toString(enc.Base64);
    const secretKey = base64ToArrayBuffer(dcBase64String);
    const keypair = Keypair.fromSecretKey(secretKey);
    return keypair;
  }

  return createGameWallet();
};

/**
 * 1. Create a new keypair
 * 2. Encrypt it with some SALT and store it on localStorage
 * 3. Return the keyapir to the caller
 */
export const createGameWallet = (): Keypair => {
  const gameWallet = new Keypair();
  const wordArray = lib.WordArray.create(gameWallet.secretKey);
  const encryptedKeypair = AES.encrypt(wordArray, SECRET_PHRASE);
  window.localStorage.setItem(STORAGE_KEY, encryptedKeypair.toString());
  return gameWallet;
};
