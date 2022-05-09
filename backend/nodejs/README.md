# pocket-cards-backend

| Status | Path                                         | Http Method | Function ID         | Comment                |
| ------ | -------------------------------------------- | ----------- | ------------------- | ---------------------- |
| OK     | /health                                      | GET         |                     | ヘルスチェック         |
| OK     | /groups                                      | POST        | GroupRegist         | グループ新規登録       |
| OK     | /groups                                      | GET         | GroupList           | グループ一覧取得       |
| OK     | /groups/:groupId                             | GET         | GroupDescribe       | グループ詳細取得       |
| OK     | /groups/:groupId                             | PUT         | GroupUpdate         | グループ情報更新       |
| NG     | /groups/:groupId                             | DELETE      | GroupRemove         | グループ削除           |
| OK     | /groups/:groupId/questions                   | POST        | QuestionRegist      | 問題集一括登録         |
| OK     | /groups/:groupId/questions                   | GET         | QuestionList        | 問題集一括取得         |
| OK     | /groups/:groupId/questions/:questionId       | PUT         | QuestionUpdate      | 問題集詳細更新         |
| NG     | /groups/:groupId/questions/:questionId       | GET         |                     | 問題集詳細取得         |
| NG     | /groups/:groupId/questions/:questionId       | DELETE      | QuestionDelete      | 問題削除               |
| OK     | /reports/dailytasks                          | GET         | DailyTasks          | 日次タスク数           |
| OK     | /reports/progress                            | GET         | LearningProgress    | 学習進捗               |
| OK     | /reports/overall                             | GET         | LearningOverall     | 全体学習進捗           |
| OK     | /reports/inquiry                             | POST        | Inquiry             | お問い合わせ           |
| OK     | /curriculums                                 | POST        | CurriculumRegist    | カリキュラム新規登録   |
| OK     | /curriculums                                 | GET         | CurriculumList      | カリキュラム一覧取得   |
| OK     | /curriculums/:curriculumId                   | DELETE      | CurriculumRemove    | カリキュラム削除       |
| NG     | /patch                                       | PATCH       | Patchs              | パッチ                 |
| NG     | /study/daily/practice/questions              | GET         | QuestionStudy       | 日次練習問題           |
| NG     | /study/daily/test/questions                  | GET         | QuestionExam        | 日次テスト問題         |
| NG     | /study/daily/test/questions/:questionId      | POST        | QuestionAnswer      | 日次テスト回答         |
| NG     | /study/weekly/:groupId                       | POST        | WeeklyAbilityRegist | 週テスト対策の問題登録 |
| NG     | /study/weekly/:groupId/questions             | GET         | WeeklyAbilityList   | 週テスト対策の問題一覧 |
| NG     | /study/weekly/:groupId/questions/:questionId | POST        | WeeklyAbilityAnswer | 週テスト問題の回答     |

## Users

### Definition

| Item   | Key  | LSI1 | LSI2 | GSI1 | GSI2 |
| ------ | ---- | ---- | ---- | ---- | ---- |
| id     | Hash |      |      |      |      |
| email  |      |      |      |      |      |
| name   |      |      |      |      |      |
| target |      |      |      |      |      |

### Search Conditions

| Status | Conditions                        |
| ------ | --------------------------------- |
| Get    | id = xxx                          |
| Put    | id = xxx, name = xxx, email = xxx |

## Groups

### Definition

| Item        | Key   | LSI1 | LSI2 | GSI1  | GSI2 |
| ----------- | ----- | ---- | ---- | ----- | ---- |
| id          | Hash  |      |      | Range |      |
| userId      | Range |      |      | Hash  |      |
| name        |       |      |      | 〇    |      |
| description |       |      |      | 〇    |      |
| count       |       |      |      |       |      |

### Search Conditions

| Status | Conditions                              | Index |
| ------ | --------------------------------------- | ----- |
| Get    | id = xxx                                |       |
| Put    | id = xxx, name = xxx, description = xxx |       |
| Del    | id = xxx                                |       |
| Query  | userId = xxx                            | GSI1  |

## Words

### Definition

| Item     | Key   | LSI1 | LSI2 | GSI1  | GSI2 |
| -------- | ----- | ---- | ---- | ----- | ---- |
| id       | Hash  |      |      | Range |      |
| groupId  | Range |      |      | Hash  |      |
| nextTime |       |      |      |       |      |
| lastTime |       |      |      |       |      |
| times    |       |      |      |       |      |

### Search Conditions

| Status       | Conditions                                             | Index |
| ------------ | ------------------------------------------------------ | ----- |
| Get          | id = xxx, groupId = xxx                                |       |
| Put          | id = xxx, groupId = xxx                                |       |
| 復習単語     | groupId = xxx, times = 1                               | GSI1  |
| テスト単語   | groupId = xxx, nextTime < Now ,times <> 0              | GSI1  |
| 新規単語     | groupId = xxx, nextTime <= Now, times = 0              | GSI1  |
| New Success  | Times = Times + 1, LastTime = now , NextTime = now ASC |       |
| Test Targets | Times <> 0, NextTime <= now                            |       |
| Test Success | Times = Times + 1, LastTime = now, NextTime = now + x  |       |
| Test Failure | Times = 0, LastTime = now, NextTime = now              |       |

## WordMaster

### Definition

| Item      | Key  | LSI1 | LSI2 | GSI1 | GSI2 |
| --------- | ---- | ---- | ---- | ---- | ---- |
| id        | Hash |      |      |      |      |
| mp3       |      |      |      |      |      |
| pronounce |      |      |      |      |      |
| ja        |      |      |      |      |      |
| zh        |      |      |      |      |      |

### Search Conditions

| Status   | Conditions |
| -------- | ---------- |
| Get Word | id = xxx   |
| Put Word | id = xxx   |

## Histroy

### Definition

| Item      | Key   | LSI1 | LSI2 | GSI1 | GSI2 |
| --------- | ----- | ---- | ---- | ---- | ---- |
| user      | Hash  |      |      |      |      |
| timestamp | Range |      |      |      |      |
| group     |       |      |      |      |      |
| word      |       |      |      |      |      |
| times     |       |      |      |      |      |
| lastTime  |       |      |      |      |      |

### Search Conditions

| Status      | Conditions                                 |
| ----------- | ------------------------------------------ |
| Get Daily   | User = xxx, Timestamp begin_with YYYYMMDD  |
| Get Weekly  | User = xxx, Timestamp >= YYYYMMDD000000000 |
| Get Monthly | User = xxx, Timestamp >= YYYYMMDD000000000 |

<!-- ## Maintenance Functions

| Function | Description                                            |
| -------- | ------------------------------------------------------ |
| M001     | Send notification to slack when build Success / Failed |
| M002     | CodeBuild state change to failed                       |
| M003     | CodePipeline state change to success                   | -->
