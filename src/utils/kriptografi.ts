import crypto from "crypto";
import { GlobalEnv } from "../helper/GlobalEnv";

export const encryptor = (userId: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    GlobalEnv.ALGHORITHM!,
    Buffer.from(GlobalEnv.PRIVATE_KEY!),
    iv
  );
  const encrypted = Buffer.concat([cipher.update(userId), cipher.final()]);
  const hasil = iv.toString("hex") + ":" + encrypted.toString("hex");
  return hasil;
};

export const decryptor = (encryptedText: string): string => {
  const [iv, encrypted] = encryptedText
    .split(":")
    .map((part) => Buffer.from(part, "hex"));
  const decipher = crypto.createDecipheriv(
    GlobalEnv.ALGHORITHM!,
    Buffer.from(GlobalEnv.PRIVATE_KEY!),
    iv
  );
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final()
  ]);
  return decrypted.toString();
};
