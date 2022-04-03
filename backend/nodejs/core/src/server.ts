import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import { A002 } from '@src/services/a0';
import { GroupRegist, GroupList, GroupDescribe, GroupUpdate, GroupRemove, B006 } from '@src/services/b0';
import { C001, C002, C003, C004, C005, C006, C007, C008 } from '@src/services/c0';
import { D001, D003, D004, D005, D006 } from '@src/services/d0';
import { E001, E002 } from '@src/services/e0';
import { QuestionRegist, QuestionStudy, QuestionExam, QuestionAnswer, QuestionList } from '@src/services/questions';
import { DailyTasks, LearningProgress } from '@src/services/reports';
import { CurriculumRegist, CurriculumList, CurriculumRemove, CurriculumDescirbe } from '@src/services/curriculums';

import entry from './entry';

const app = express();

app.use(json({ limit: '50mb' }));
app.use(urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(cors());

app.options('*', (_, res) => res.sendStatus(200));
// health check
app.get('/v1/backend', (_, res) => res.send('v3.1.0'));

// ユーザ学習履歴
app.get('/v1/history', express.json(), (req, res) => entry(req, res, A002));

// グループ新規
app.put('/v1/groups', express.json(), (req, res) => entry(req, res, GroupRegist));
// グループ一覧
app.get('/v1/groups', express.json(), (req, res) => entry(req, res, GroupList));
// グループ一覧
app.get('/v1/groups/:groupId', express.json(), (req, res) => entry(req, res, GroupDescribe));
// グループ更新
app.put('/v1/groups/:groupId', express.json(), (req, res) => entry(req, res, GroupUpdate));
// グループ削除
app.delete('/v1/groups/:groupId', express.json(), (req, res) => entry(req, res, GroupRemove));
// グループ学習状態
app.get('/v1/groups/:groupId/status', express.json(), (req, res) => entry(req, res, B006 as any));
// 単語一括登録
app.post('/v1/groups/:groupId/words', express.json(), (req, res) => entry(req, res, C001 as any));
// 単語一括取得
app.get('/v1/groups/:groupId/words', express.json(), (req, res) => entry(req, res, C002 as any));
// 単語情報取得
app.get('/v1/groups/:groupId/words/:word', express.json(), (req, res) => entry(req, res, C003 as any));
// 単語情報更新
app.put('/v1/groups/:groupId/words/:word', express.json(), (req, res) => entry(req, res, C004 as any));
// 単語情報削除
app.delete('/v1/groups/:groupId/words/:word', express.json(), (req, res) => entry(req, res, C005 as any));
// 新規学習モード単語一覧
app.get('/v1/groups/:groupId/new', express.json(), (req, res) => entry(req, res, C006 as any));
// テストモード単語一覧
app.get('/v1/groups/:groupId/test', express.json(), (req, res) => entry(req, res, C007 as any));
// 復習モード単語一覧
app.get('/v1/groups/:groupId/review', express.json(), (req, res) => entry(req, res, C008));
// 画像から単語に変換する
app.post('/v1/image2text', express.json(), (req, res) => entry(req, res, D001));
// 画像から単語に変換する
app.post('/v1/user/wordignore', express.json(), (req, res) => entry(req, res, D003));

// 今日のテスト単語一覧
app.get('/v1/today/test', express.json(), (req, res) => entry(req, res, D004));
// 今日の再学習単語一覧
app.get('/v1/today/new', express.json(), (req, res) => entry(req, res, D005));
// 今日の復習単語一覧
app.get('/v1/today/review', express.json(), (req, res) => entry(req, res, D006));

// 単語詳細情報取得
app.get('/v1/words/:word', express.json(), (req, res) => entry(req, res, E001 as any));
// 単語詳細情報取得
app.put('/v1/words/:word', express.json(), (req, res) => entry(req, res, E002 as any));

// 問題一括登録
app.post('/v1/groups/:groupId/questions', express.json(), (req, res) => entry(req, res, QuestionRegist));
// 問題詳細一括取得
app.get('/v1/groups/:groupId/questions', express.json(), (req, res) => entry(req, res, QuestionList));

// 今日の学習
app.get('/v1/questions/study', express.json(), (req, res) => entry(req, res, QuestionStudy));
// 今日のテスト
app.get('/v1/questions/test', express.json(), (req, res) => entry(req, res, QuestionExam));

// 問題情報更新
app.post('/v1/questions/:questionId/answer', express.json(), (req, res) => entry(req, res, QuestionAnswer as any));

// Report daily
app.get('/v1/reports/dailytasks', express.json(), (req, res) => entry(req, res, DailyTasks as any));
// leaning progress
app.get('/v1/reports/progress', express.json(), (req, res) => entry(req, res, LearningProgress as any));

// カリキュラム登録
app.put('/v1/curriculums', express.json(), (req, res) => entry(req, res, CurriculumRegist));
// カリキュラム一覧
app.get('/v1/curriculums', express.json(), (req, res) => entry(req, res, CurriculumList));
// カリキュラム削除
app.delete('/v1/curriculums/:curriculumId', express.json(), (req, res) => entry(req, res, CurriculumRemove));

export default app;
