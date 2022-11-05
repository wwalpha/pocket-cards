# APIs

- Backend(Core)
- Auth Manager
- User Manager

## Core

| Status | Path                                 | Http Method | Function ID         | Comment                |
| :----: | ------------------------------------ | ----------- | ------------------- | ---------------------- |
|   OK   | /health                              | GET         |                     | ヘルスチェック         |
|   OK   | /groups                              | POST        | GroupRegist         | グループ新規登録       |
|   OK   | /groups                              | GET         | GroupList           | グループ一覧取得       |
|   OK   | /groups/:groupId                     | GET         | GroupDescribe       | グループ詳細情報取得   |
|   OK   | /groups/:groupId                     | PUT         | GroupUpdate         | グループ詳細情報更新   |
|   OK   | /groups/:groupId                     | DELETE      | GroupRemove         | グループ削除           |
|   OK   | /questions                           | POST        | QuestionRegist      | 問題新規登録           |
|   OK   | /questions                           | GET         | QuestionList        | 問題一覧取得           |
|   OK   | /questions/:questionId               | GET         | QuestionDescribe    | 問題詳細取得           |
|   OK   | /questions/:questionId               | PUT         | QuestionUpdate      | 問題詳細情報更新       |
|   OK   | /questions/:questionId               | DELETE      | QuestionDelete      | 問題削除               |
|   OK   | /curriculums                         | POST        | CurriculumRegist    | カリキュラム新規登録   |
|   OK   | /curriculums                         | GET         | CurriculumList      | カリキュラム一覧取得   |
|   OK   | /curriculums/:curriculumId           | UPDATE      | CurriculumOrder     | カリキュラム更新       |
|   OK   | /curriculums/:curriculumId           | DELETE      | CurriculumRemove    | カリキュラム削除       |
|   OK   | /curriculums/:curriculumId/questions | GET         | CurriculumQuestions | カリキュラムの問題一覧 |
|   NG   | /curriculums/:curriculumId/progress  | GET         | CurriculumStatus    | カリキュラムの学習進捗 |
|   OK   | /inquiries                           | POST        | InquiryRegist       | 問い合わせ新規登録     |
|   OK   | /inquiries                           | GET         | InquiryList         | 問い合わせ一覧取得     |
|   OK   | /inquiries/:id                       | DELETE      | InquiryRemove       | 問い合わせ削除         |
|   OK   | /reports/status/times                | GET         | LearningProgress    | 学習回数別進捗状況     |
|   OK   | /reports/status/overall              | GET         | LearningOverall     | 全体学習状況           |
|   OK   | /reports/status/overall??            | GET         | OverallStatus       | 全体学習状況           |
|   OK   | /reports/status/daily??              | GET         | DailyStatus         | 日次学習状況           |
|   OK   | /reports/questions/daily??           | POST        | DailyTestQuestions  | 科目別テスト問題の一覧 |
|   OK   | /study/daily/practice                | POST        | QuestionStudy       | 自己練習問題取得       |
|   OK   | /study/daily/test                    | POST        | QuestionExam        | 自己テスト問題取得     |
|   NG   | /study/daily/answer                  | POST        | QuestionAnswer      | 自己テスト問題更新     |
|   OK   | /study/weekly                        | POST        | WeeklyRegist        | 週テスト対策の問題登録 |
|   OK   | /study/weekly                        | GET         | WeeklyList          | 週テスト対策の問題一覧 |
|   OK   | /patch                               | PATCH       | Patchs              | パッチ                 |

```
// カリキュラム順で学習
app.get('/v1/study/daily/order/questions', express.json(), (req, res) => entry(req, res, QuestionOrder));
// 復習問題取得
app.get('/v1/study/daily/review/questions', express.json(), (req, res) => entry(req, res, QuestionReview));
// カリキュラムの問題集一覧
app.get('/v1/curriculums/:curriculumId/questions/:questionId/ignore', express.json(), (req, res) =>
entry(req, res, CurriculumIgnore)
);

// 問題無視機能
app.post('/v1/groups/:groupId/questions/ignore', express.json(), (req, res) => entry(req, res, QuestionIgnore));

// 週テスト対策の実力テストの回答
app.post('/v1/study/weekly/:questionId', express.json(), (req, res) => entry(req, res, WeeklyAnswer));

// 対象問題の学習状況取得
app.get('/v1/study/learning/:qid', express.json(), (req, res) => entry(req, res, LearningDescribe));

// handwriting
app.post('/v1/vision/handwriting', express.json(), (req, res) => entry(req, res, Handwriting));
```

## Core API Permission

| Path                   | Description          | Admin | Guardian | Student |
| ---------------------- | -------------------- | :---: | :------: | :-----: |
| /health                | ヘルスチェック       |  〇   |    〇    |   〇    |
| /groups                | グループ新規登録     |  〇   |          |         |
| /groups                | グループ一覧取得     |  〇   |    〇    |         |
| /groups/:groupId       | グループ詳細情報取得 |  〇   |    〇    |         |
| /groups/:groupId       | グループ詳細情報更新 |  〇   |          |         |
| /groups/:groupId       | グループ削除         |  〇   |          |         |
| /questions             | 問題新規登録         |  〇   |          |         |
| /questions             | 問題一覧取得         |  〇   |    〇    |         |
| /questions/:questionId | 問題詳細取得         |  〇   |    〇    |         |
| /questions/:questionId | 問題詳細情報更新     |  〇   |          |         |
| /questions/:questionId | 問題削除             |  〇   |          |         |
| /inquiries             | 問い合わせ新規登録   |       |          |   〇    |
| /inquiries             | 問い合わせ一覧取得   |  〇   |          |         |
| /inquiries/:id         | 問い合わせ削除       |  〇   |          |         |

## Auth Manager

| Status | Path          | Http Method | Function ID  | Comment        |
| :----: | ------------- | ----------- | ------------ | -------------- |
|   OK   | /health       | GET         |              | ヘルスチェック |
|   OK   | /auth/login   | POST        | Login        | ユーザログイン |
|   OK   | /auth/refresh | POST        | TokenRefresh | Token Refresh  |

## Auth Manager API Permission

| Path          | Description    | Admin | Guardian | Student |
| ------------- | -------------- | :---: | :------: | :-----: |
| /health       | ヘルスチェック |  〇   |    〇    |   〇    |
| /auth/login   | ユーザログイン |  〇   |    〇    |   〇    |
| /auth/refresh | Token Refresh  |  〇   |    〇    |   〇    |

## User Manager

| Status | Path            | Http Method | Function ID     | Comment          |
| :----: | --------------- | ----------- | --------------- | ---------------- |
|   OK   | /health         | GET         | HealthCheck     | ヘルスチェック   |
|   OK   | /users/admins   | POST        | CreateAdminUser | Admin ユーザ作成 |
|   OK   | /users/admins   | GET         | ListAdminUsers  | Admin ユーザ一覧 |
|   OK   | /users          | POST        | CreateUser      | ユーザ作成       |
|   OK   | /users/:userId  | GET         | DescribeUser    | ユーザ情報取得   |
|   OK   | /users/:userId  | UPDATE      | UpdateUser      | ユーザ情報更新   |
|   OK   | /users/students | POST        | CreateStudent   | 生徒作成         |
|   OK   | /users/students | GET         | ListStudents    | 生徒一覧取得     |
|   OK   | /users/pool/:id | GET         | LookupUser      | ユーザ検索       |

## User Manager API Permission

| Path            | Description      | Admin | Guardian | Student |
| --------------- | ---------------- | :---: | :------: | :-----: |
| /health         | ヘルスチェック   |  〇   |    〇    |         |
| /users/admins   | Admin ユーザ作成 |  〇   |          |
| /users/admins   | Admin ユーザ一覧 |  〇   |          |
| /users          | ユーザ作成       |  〇   |          |
| /users/:userId  | ユーザ情報取得   |  〇   |          |
| /users/:userId  | ユーザ情報更新   |  〇   |          |
| /users/students | 生徒作成         |       |    〇    |
| /users/students | 生徒一覧取得     |       |    〇    |
| /users/pool/:id | ユーザ検索       |       |    〇    |
