import 'colors';

import fs from 'fs';
import crypto from 'crypto';
import rimraf from 'rimraf';
import { promisify } from 'util';

import { config } from '@/libs/config';

const generateJwtKeyPair = async () => {
  const jwtKeysConfig = config.global.auth.jwtKeys;

  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: jwtKeysConfig.keyLength,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: jwtKeysConfig.cipher,
      passphrase: jwtKeysConfig.passphrase,
    },
  });

  const mkdir = promisify(fs.mkdir);
  const asyncRimraf = promisify(rimraf);

  await asyncRimraf(jwtKeysConfig.location.keyPath);
  await mkdir(jwtKeysConfig.location.keyPath, { recursive: true });
  fs.writeFileSync(jwtKeysConfig.location.privateKeyPath, privateKey);
  fs.writeFileSync(jwtKeysConfig.location.publicKeyPath, publicKey);

  return `Kay pair successfully created on path: ${jwtKeysConfig.location.keyPath.cyan}`;
};

export default generateJwtKeyPair;
