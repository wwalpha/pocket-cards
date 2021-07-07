import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import { B001, B002, B003, B004, B005 } from '@src/b0';
import { C001, C002, C003, C004, C005, C006, C007, C008 } from '@src/c0';
import { D001 } from '@src/d0';
import { E001, E002 } from '@src/e0';
import entry from './entry';
import { APIs } from 'typings';

const app = express();

app.use(json({ limit: '50mb' }));
app.use(urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(cors());

app.options('*', (_, res) => res.sendStatus(200));
// health check
app.get('/', (_, res) => res.send('v3.1.0'));
// グループ新規
app.put('/groups', express.json(), (req, res) => entry(req, res, B001));
// グループ一覧
app.get('/groups', express.json(), (req, res) => entry(req, res, B002));
// グループ一覧
app.get('/groups/:groupId', express.json(), (req, res) => entry(req, res, B003));
// グループ更新
app.put('/groups/:groupId', express.json(), (req, res) => entry(req, res, B004));
// グループ削除
app.delete('/groups/:groupId', express.json(), (req, res) => entry(req, res, B005));
// 単語一括登録
app.post('/groups/:groupId/words', express.json(), (req, res) => entry(req, res, C001 as any));
// 単語一括取得
app.get('/groups/:groupId/words', express.json(), (req, res) => entry(req, res, C002 as any));
// 単語情報取得
app.get('/groups/:groupId/words/:word', express.json(), (req, res) => entry(req, res, C003 as any));
// 単語情報更新
app.put('/groups/:groupId/words/:word', express.json(), (req, res) => entry(req, res, C004 as any));
// 単語情報削除
app.delete('/groups/:groupId/words/:word', express.json(), (req, res) => entry(req, res, C005 as any));
// 新規学習モード単語一覧
app.get('/groups/:groupId/new', express.json(), (req, res) => entry(req, res, C006 as any));
// テストモード単語一覧
app.get('/groups/:groupId/test', express.json(), (req, res) => entry(req, res, C007 as any));
// 復習モード単語一覧
app.get('/groups/:groupId/review', express.json(), (req, res) => entry(req, res, C008));
// 画像から単語に変換する
app.post('/image2text', express.json(), (req, res) => entry(req, res, D001));
// 単語詳細情報取得
app.get('/words/:word', express.json(), (req, res) => entry(req, res, E001 as any));
// 単語詳細情報取得
app.put('/words/:word', express.json(), (req, res) => entry(req, res, E002 as any));

app.listen(process.env.EXPOSE_PORT || 8080, () => {
  console.log('Started...');
  console.log('Port: ', process.env.EXPOSE_PORT || 8080);
  console.log(process.env);
});

// console.log(process.env);

// (async () => {
//   const ngrok = require('ngrok');

//   const url = await ngrok.connect(8080);

//   console.log(url);
// })();

export default app;
