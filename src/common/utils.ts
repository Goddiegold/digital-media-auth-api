import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { Config } from 'src/config';

export const IS_DEV_ENV = Config.NODE_ENV === 'development';

export const errorMessage = (error: any) => {
  // if (showLog)
  console.log(`<<<<<<<<<<${JSON.stringify(error, null, 2)}>>>>>>>>>>`);
  return (
    error?.response?.data?.message || error?.message || 'Something went wrong'
  );
};

export const generateHashedString = (rawString: string): string =>
  bcrypt.hashSync(rawString, 10);

export const compareHasWithRawString = (
  rawString: string,
  hashedString: string,
): boolean => bcrypt.compareSync(rawString, hashedString);

export const generateOTL = () => {
  //OTL - One Time Link
  return {
    otl: randomBytes(20).toString('hex'),
    expires: Date.now() + 3600000, //expires in an hour
    // expires: Date.now() + 300000
  };
};

export function generateRandomString({ max = 5 }: { max: number }): string {
  let result = '';
  for (let i = 0; i < max; i++) {
    const digit = Math.floor(Math.random() * 10); // 0 to 9
    result += digit.toString();
  }
  return result;
}

// Function to hash the biometric key using SHA256 for lookup
export function sha256Hash(data: string) {
  return createHash('sha256').update(data).digest('hex');
}
