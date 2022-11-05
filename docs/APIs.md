# APIs

- Backend(Core)
- Auth Manager
- User Manager

## Core

| Status | Path                   | Http Method | Function ID      | Comment              |
| ------ | ---------------------- | ----------- | ---------------- | -------------------- |
| OK     | /health                | GET         |                  | ヘルスチェック       |
| OK     | /groups                | POST        | GroupRegist      | グループ新規登録     |
| OK     | /groups                | GET         | GroupList        | グループ一覧取得     |
| OK     | /groups/:groupId       | GET         | GroupDescribe    | グループ詳細情報取得 |
| OK     | /groups/:groupId       | PUT         | GroupUpdate      | グループ詳細情報更新 |
| OK     | /groups/:groupId       | DELETE      | GroupRemove      | グループ削除         |
| OK     | /questions             | POST        | QuestionRegist   | 問題新規登録         |
| OK     | /questions             | GET         | QuestionList     | 問題一覧取得         |
| OK     | /questions/:questionId | GET         | QuestionDescribe | 問題詳細取得         |
| OK     | /questions/:questionId | PUT         | QuestionUpdate   | 問題詳細情報更新     |
| OK     | /questions/:questionId | DELETE      | QuestionDelete   | 問題削除             |
| OK     | /inquiries             | POST        | InquiryRegist    | 問い合わせ新規登録   |
| OK     | /inquiries             | GET         | InquiryList      | 問い合わせ一覧取得   |
| OK     | /inquiries/:id         | DELETE      | InquiryRemove    | 問い合わせ削除       |

## Core API Permission

| Path                   | Description          | Admin | Guardian | Student |
| ---------------------- | -------------------- | ----- | -------- | ------- |
| /health                | ヘルスチェック       | 〇    | 〇       | 〇      |
| /groups                | グループ新規登録     | 〇    |          |         |
| /groups                | グループ一覧取得     | 〇    | 〇       |         |
| /groups/:groupId       | グループ詳細情報取得 | 〇    | 〇       |         |
| /groups/:groupId       | グループ詳細情報更新 | 〇    |          |         |
| /groups/:groupId       | グループ削除         | 〇    |          |         |
| /questions             | 問題新規登録         | 〇    |          |         |
| /questions             | 問題一覧取得         | 〇    | 〇       |         |
| /questions/:questionId | 問題詳細取得         | 〇    | 〇       |         |
| /questions/:questionId | 問題詳細情報更新     | 〇    |          |         |
| /questions/:questionId | 問題削除             | 〇    |          |         |
| /inquiries             | 問い合わせ新規登録   |       |          | 〇      |
| /inquiries             | 問い合わせ一覧取得   | 〇    |          |         |
| /inquiries/:id         | 問い合わせ削除       | 〇    |          |         |

```
// 問題無視機能
app.post('/v1/groups/:groupId/questions/ignore', express.json(), (req, res) => entry(req, res, QuestionIgnore));
// leaning progress
app.get('/v1/reports/progress', express.json(), (req, res) => entry(req, res, LearningProgress));
// leaning overall
app.get('/v1/reports/overall', express.json(), (req, res) => entry(req, res, LearningOverall));
// 全体学習進捗
app.get('/v1/reports/status/overall', express.json(), (req, res) => entry(req, res, OverallStatus));
// 日次学習進捗
app.get('/v1/reports/status/daily', express.json(), (req, res) => entry(req, res, DailyStatus));

// カリキュラム別の学習状況
app.get('/v1/reports/curriculums/:curriculumId', express.json(), (req, res) => entry(req, res, CurriculumStatus));
// 科目別テスト問題の一覧
app.post('/v1/reports/questions/dailytest', express.json(), (req, res) => entry(req, res, DailyTestQuestions));

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
app.post('/v1/study/weekly', express.json(), (req, res) => entry(req, res, WeeklyRegist));
// 週テスト対策の問題一覧
app.get('/v1/study/weekly', express.json(), (req, res) => entry(req, res, WeeklyList));
// 週テスト対策の実力テストの回答
app.post('/v1/study/weekly/:questionId', express.json(), (req, res) => entry(req, res, WeeklyAnswer));

// カリキュラム順で学習
app.get('/v1/study/daily/order/questions', express.json(), (req, res) => entry(req, res, QuestionOrder));
// 復習問題取得
app.get('/v1/study/daily/review/questions', express.json(), (req, res) => entry(req, res, QuestionReview));
// 練習問題取得
app.get('/v1/study/daily/practice/questions', express.json(), (req, res) => entry(req, res, QuestionStudy));
// テスト問題取得
app.get('/v1/study/daily/test/questions', express.json(), (req, res) => entry(req, res, QuestionExam));
// テスト問題更新
app.post('/v1/study/daily/test/questions/:questionId', express.json(), (req, res) => entry(req, res, QuestionAnswer));

// 対象問題の学習状況取得
app.get('/v1/study/learning/:qid', express.json(), (req, res) => entry(req, res, LearningDescribe));

// patch
app.patch('/v1/patch', express.json(), (req, res) => entry(req, res, Patchs));

// handwriting
app.post('/v1/vision/handwriting', express.json(), (req, res) => entry(req, res, Handwriting));
```

## Auth Manager

| Status | Path          | Http Method | Function ID  | Comment        |
| ------ | ------------- | ----------- | ------------ | -------------- |
| OK     | /health       | GET         |              | ヘルスチェック |
| OK     | /auth/login   | POST        | Login        | ユーザログイン |
| OK     | /auth/refresh | POST        | TokenRefresh | Token Refresh  |

## User Manager

| Status | Path            | Http Method | Function ID     | Comment          |
| ------ | --------------- | ----------- | --------------- | ---------------- |
| OK     | /health         | GET         | HealthCheck     | ヘルスチェック   |
| OK     | /users/admins   | POST        | CreateAdminUser | Admin ユーザ作成 |
| OK     | /users/admins   | GET         | ListAdminUsers  | Admin ユーザ一覧 |
| OK     | /users          | POST        | CreateUser      | ユーザ作成       |
| OK     | /users/:userId  | GET         | DescribeUser    | ユーザ情報取得   |
| OK     | /users/:userId  | UPDATE      | UpdateUser      | ユーザ情報更新   |
| OK     | /users/students | POST        | CreateStudent   | 生徒作成         |
| OK     | /users/students | GET         | ListStudents    | 生徒一覧取得     |
| OK     | /users/pool/:id | GET         | LookupUser      | ユーザ検索       |
