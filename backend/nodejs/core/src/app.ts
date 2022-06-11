import express from 'express';
import morgan from 'morgan';
import { json, urlencoded } from 'body-parser';
import { A002 } from '@src/apis/a0';
import { GroupRegist, GroupList, GroupDescribe, GroupUpdate, GroupRemove } from '@src/apis/groups';
import {
  QuestionRegist,
  QuestionStudy,
  QuestionExam,
  QuestionAnswer,
  QuestionList,
  QuestionUpdate,
  QuestionDelete,
  QuestionIgnore,
} from '@src/apis/questions';
import { DailyTasks, LearningProgress, LearningOverall, Inquiry } from '@src/apis/reports';
import {
  CurriculumRegist,
  CurriculumList,
  CurriculumRemove,
  CurriculumQuestions,
  CurriculumOrder,
  CurriculumIgnore,
} from '@src/apis/curriculums';
import { WeeklyAbilityRegist, WeeklyAbilityList, WeeklyAbilityAnswer } from '@src/apis/weekly';
import { Patchs } from '@src/apis/patch';

import entry from './entry';

const app = express();

app.use(json({ limit: '50mb' }));
app.use(urlencoded({ extended: true }));
app.use(morgan('combined'));
app.disable('x-powered-by');

app.options('*', (_, res) => res.sendStatus(200));
// health check
app.get('/v1/health', (_, res) => res.send('backend'));

// ユーザ学習履歴
app.get('/v1/history', express.json(), (req, res) => entry(req, res, A002));

// グループ新規
app.post('/v1/groups', express.json(), (req, res) => entry(req, res, GroupRegist));
// グループ一覧
app.get('/v1/groups', express.json(), (req, res) => entry(req, res, GroupList));
// グループ一覧
app.get('/v1/groups/:groupId', express.json(), (req, res) => entry(req, res, GroupDescribe));
// グループ更新
app.put('/v1/groups/:groupId', express.json(), (req, res) => entry(req, res, GroupUpdate));
// グループ削除
app.delete('/v1/groups/:groupId', express.json(), (req, res) => entry(req, res, GroupRemove));

// グループ学習状態
// app.get('/v1/groups/:groupId/status', express.json(), (req, res) => entry(req, res, B006 as any));
// // 単語一括登録
// app.post('/v1/groups/:groupId/words', express.json(), (req, res) => entry(req, res, C001 as any));
// // 単語一括取得
// app.get('/v1/groups/:groupId/words', express.json(), (req, res) => entry(req, res, C002 as any));
// // 単語情報取得
// app.get('/v1/groups/:groupId/words/:word', express.json(), (req, res) => entry(req, res, C003 as any));
// // 単語情報更新
// app.put('/v1/groups/:groupId/words/:word', express.json(), (req, res) => entry(req, res, C004 as any));
// // 単語情報削除
// app.delete('/v1/groups/:groupId/words/:word', express.json(), (req, res) => entry(req, res, C005 as any));
// // 新規学習モード単語一覧
// app.get('/v1/groups/:groupId/new', express.json(), (req, res) => entry(req, res, C006 as any));
// // テストモード単語一覧
// app.get('/v1/groups/:groupId/test', express.json(), (req, res) => entry(req, res, C007 as any));
// // 復習モード単語一覧
// app.get('/v1/groups/:groupId/review', express.json(), (req, res) => entry(req, res, C008));
// // 画像から単語に変換する
// app.post('/v1/image2text', express.json(), (req, res) => entry(req, res, D001));
// // 画像から単語に変換する
// app.post('/v1/user/wordignore', express.json(), (req, res) => entry(req, res, D003));

// 問題一括登録
app.post('/v1/groups/:groupId/ignore', express.json(), (req, res) => entry(req, res, QuestionIgnore));
// 問題一括登録
app.post('/v1/groups/:groupId/questions', express.json(), (req, res) => entry(req, res, QuestionRegist));
// 問題詳細一括取得
app.get('/v1/groups/:groupId/questions', express.json(), (req, res) => entry(req, res, QuestionList));
// 問題集詳細更新
app.put('/v1/groups/:groupId/questions/:questionId', express.json(), (req, res) => entry(req, res, QuestionUpdate));
// 問題集詳細取得
app.get('/v1/groups/:groupId/questions/:questionId', express.json(), (req, res) => entry(req, res, QuestionList));
// 問題集削除
app.delete('/v1/groups/:groupId/questions/:questionId', express.json(), (req, res) => entry(req, res, QuestionDelete));

// Report daily
app.get('/v1/reports/dailytasks', express.json(), (req, res) => entry(req, res, DailyTasks));
// leaning progress
app.get('/v1/reports/progress', express.json(), (req, res) => entry(req, res, LearningProgress));
// leaning progress
app.get('/v1/reports/overall', express.json(), (req, res) => entry(req, res, LearningOverall));
// 問い合わせ
app.post('/v1/reports/inquiry', express.json(), (req, res) => entry(req, res, Inquiry));

// カリキュラム登録
app.post('/v1/curriculums', express.json(), (req, res) => entry(req, res, CurriculumRegist));
// カリキュラム一覧
app.get('/v1/curriculums', express.json(), (req, res) => entry(req, res, CurriculumList));
// カリキュラム削除
app.delete('/v1/curriculums/:curriculumId', express.json(), (req, res) => entry(req, res, CurriculumRemove));
// カリキュラムの問題集一覧
app.get('/v1/curriculums/:curriculumId/questions', express.json(), (req, res) => entry(req, res, CurriculumQuestions));
// カリキュラム並べ順更新
app.post('/v1/curriculums/:curriculumId/order', express.json(), (req, res) => entry(req, res, CurriculumOrder));
// カリキュラムの問題集一覧
app.get('/v1/curriculums/:curriculumId/questions/:questionId/ignore', express.json(), (req, res) =>
  entry(req, res, CurriculumIgnore)
);

// 週テスト対策の問題登録
app.post('/v1/study/weekly', express.json(), (req, res) => entry(req, res, WeeklyAbilityRegist));
// 週テスト対策の問題一覧
app.get('/v1/study/weekly/:groupId/questions', express.json(), (req, res) => entry(req, res, WeeklyAbilityList));
// 週テスト対策の実力テストの回答
app.post('/v1/study/weekly/:groupId/questions/:questionId', express.json(), (req, res) =>
  entry(req, res, WeeklyAbilityAnswer)
);

// 練習問題取得
app.get('/v1/study/daily/practice/questions', express.json(), (req, res) => entry(req, res, QuestionStudy));
// テスト問題取得
app.get('/v1/study/daily/test/questions', express.json(), (req, res) => entry(req, res, QuestionExam));
// テスト問題更新
app.post('/v1/study/daily/test/questions/:questionId', express.json(), (req, res) => entry(req, res, QuestionAnswer));

// patch
app.patch('/v1/patch', express.json(), (req, res) => entry(req, res, Patchs));

export default app;
