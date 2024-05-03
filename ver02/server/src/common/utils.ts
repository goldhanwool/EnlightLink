//*----------------------------------------*
//       IP 주소를 가져오는 함수
//*----------------------------------------*
import { Request } from 'express';
export const getIp = async (req: Request) => {
  console.log(
    '[[getIp]] > req.headers[x-forwarded-for]: ',
    req.headers['x-forwarded-for'],
  );
  console.log('[[getIp]] > req.IP: ', req.ip);

  const xForwardedFor = req.headers['x-forwarded-for'];

  return Array.isArray(xForwardedFor)
    ? xForwardedFor[0]
    : xForwardedFor || req.ip;
};

//*----------------------------------------*
//       ObjectId를 문자열로 변환하는 함수
//*----------------------------------------*
export const transferIdToString = async (_id: any) => {
  return _id.toString();
};

//*----------------------------------------*
//            multer.config.ts
//*----------------------------------------*
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: 'src/uploads/files',
    filename: (req, file, callback) => {
      const fileExtName = path.extname(file.originalname);
      const filename = `${uuidv4()}END-START${fileExtName}`;
      callback(null, filename);
    },
  }),
  fileFilter: (req, file, callback) => {
    //if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
    if (!file.originalname.match(/\.pdf$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
};

//*----------------------------------------*
//            GPT 요금 계산 함수
//*----------------------------------------*
export function fee(promptTokens, completionTokens) {
  // Current exchange rate from USD to KRW
  const dollarWon = 1309.02;
  // Calculate the total fee in USD
  // Assuming the first component is 0.0015% of response and the second is 0.002‰ (permille) of response
  const totalFeeUSD =
    (promptTokens * 0.0015) / 1000 + (completionTokens * 0.002) / 1000;
  // Convert the total fee from USD to KRW
  const totalFeeKRW = totalFeeUSD * dollarWon;
  return totalFeeKRW;
}
