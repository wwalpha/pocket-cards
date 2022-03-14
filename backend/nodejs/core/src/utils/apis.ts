import { Environment } from '@consts';
import axios from 'axios';
import { IPAResponse } from 'typings';

/** 発音データ取得する */
export const getPronounce = async (word: string): Promise<IPAResponse> => {
  const res = await axios.get(`${Environment.IPA_API_URL}?word=${word}`, {
    headers: {
      'x-api-key': Environment.IPA_API_KEY,
    },
  });

  return res.data;
};

/** 翻訳 */
export const getTranslate = async (word: string, targetLanguageCode: string): Promise<string> => {
  const res = await axios.post(`${Environment.TRANSLATION_API_URL}?key=${Environment.TRANSLATION_API_KEY}`, {
    q: word,
    from: 'en',
    target: targetLanguageCode,
    format: 'text',
  });

  const translations = res.data.data.translations;

  // 結果ない場合、エラーとする
  if (!translations || translations.length === 0) {
    throw new Error(`翻訳できません。Word:${word}`);
  }

  return translations[0].translatedText;
};

export const getImage = async (url: string): Promise<Buffer | undefined> => {
  // validation
  if (url.indexOf('.') === -1) return;

  // get extension
  const ext = url.split('.').pop();
  let contentType = 'image/png';

  switch (ext?.toUpperCase()) {
    case 'JPEG':
      contentType = 'image/jpeg';
      break;
    case 'JPG':
      contentType = 'image/jpeg';
      break;
    case 'PNG':
      contentType = 'image/png';
      break;
    case 'GIF':
      contentType = 'image/gif';
      break;
    case 'BMP':
      contentType = 'image/bmp';
      break;
    default:
      break;
  }

  const res = await axios.get<Buffer>(url, {
    headers: {
      'Content-Type': contentType,
    },
    responseType: 'arraybuffer',
  });

  // get failed
  return res.data;
};
