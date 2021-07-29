import { Environment } from '@consts';
import axios from 'axios';
import { IPAResponse } from 'typings';

/** 発音データ取得する */
export const getPronounce = async (word: string): Promise<IPAResponse> => {
  const res = await axios.get(`${Environment.IPA_URL}?word=${word}`, {
    headers: {
      'x-api-key': Environment.IPA_API_KEY,
    },
  });

  return res.data;
};

/** 翻訳 */
export const getTranslate = async (word: string, targetLanguageCode: string): Promise<string> => {
  const {
    data: {
      data: { translations },
    },
  } = await axios.post(`${Environment.TRANSLATION_URL}?key=${Environment.TRANSLATION_API_KEY}`, {
    q: word,
    from: 'en',
    target: targetLanguageCode,
    format: 'text',
  });

  // 結果ない場合、エラーとする
  if (!translations || translations.length === 0) {
    throw new Error(`翻訳できません。Word:${word}`);
  }

  return translations[0].translatedText;
};
