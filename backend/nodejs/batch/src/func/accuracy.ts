import { SUBJECT } from '@src/utils/consts';
import { DBHelper, Environments } from '@utils';
import { Athena } from 'aws-sdk';
import moment from 'moment';
import { AccuracyRow, Tables } from 'typings';

const client = new Athena({
  region: Environments.AWS_REGION,
});

export default async () => {
  // now
  const timestamp = Environments.ATHENA_TIMESTAMP ? '19900101' : moment().add(-1, 'days').format('YYYYMMDD');
  const userId = 'Google_109439805128280065775';

  const query = ATHENA_QUERY(userId, timestamp);

  console.log('Athena start query...');

  // start query
  const { QueryExecutionId } = await client
    .startQueryExecution({
      QueryString: query,
      WorkGroup: Environments.ATHENA_WORKGROUP_NAME,
    })
    .promise();

  // validation
  if (!QueryExecutionId) throw new Error('Athena excution has errors.');

  // wait for execution
  await waitForAthenaExecution(QueryExecutionId);

  // get query results
  const results = await client
    .getQueryResults({
      QueryExecutionId: QueryExecutionId,
    })
    .promise();

  const originRows = results.ResultSet?.Rows;

  // no results
  if (!originRows || originRows.length < 2) return;

  console.log(originRows);
  // remove header row
  originRows.shift();

  // fix datas
  const dataRows = originRows
    .map<AccuracyRow | undefined>((item) => {
      if (!item.Data || item.Data.length !== 2) return undefined;

      const qid = item.Data[0].VarCharValue;
      const accuracy = item.Data[1].VarCharValue;

      return {
        qid: qid ?? 'NOT_FOUND',
        accuracy: accuracy ? Number(accuracy) : 0,
      };
    })
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined)
    .filter((item) => item.accuracy < Number(Environments.ACCURACY_RATE));

  // 理科、社会の６年のグループ一覧
  const groups = await getGradeSixGroups();

  // create update sql
  const tasks = dataRows.map(async (item) => {
    // update accuracy
    await DBHelper().put<Tables.TAccuracy>({
      TableName: Environments.TABLE_NAME_ACCURACY,
      Item: {
        qid: item.qid,
        accuracy: item.accuracy,
        uid: userId,
      },
    });

    // search learning info
    const learning = await DBHelper().get<Tables.TLearning>({
      TableName: Environments.TABLE_NAME_LEARNING,
      Key: {
        qid: item.qid,
        userId: userId,
      },
    });

    const gid = learning?.Item?.groupId;

    // validation
    if (!gid || !groups.includes(gid)) return;

    // テーブル更新
    await DBHelper().put({
      TableName: Environments.TABLE_NAME_LEARNING,
      Item: {
        ...learning.Item,
        priority: '1',
      },
    });
  });

  // update priority
  await Promise.all(tasks);
};

const ATHENA_QUERY = (userId: string, timestamp: string) => `
WITH 
COUNTED AS (
  SELECT item.qid as qid,
    (
      CASE
        WHEN "item"."timesafter" > "item"."timesbefore" then 1 else 0
      END
    ) AS correct
  FROM "${Environments.ATHENA_SCHEMA_NAME}"."learningtrace"
  WHERE item.userid = '${userId}'
    AND item.timesbefore <> 0
    AND item.subject IN ('2', '3')
),
DAILY AS (
  SELECT item.qid as qid
  FROM "${Environments.ATHENA_SCHEMA_NAME}"."learningtrace"
  WHERE item.userid = '${userId}'
    AND item.timesbefore <> 0
    AND item.subject IN ('2', '3')
    AND item."timestamp" > '${timestamp}'
)
SELECT DAILY.qid,
(
  CAST(sum(correct) AS decimal(7, 2)) / CAST(count(*) AS decimal(7, 2)) * 100
) AS percent
FROM COUNTED, DAILY
WHERE COUNTED.qid = DAILY.qid
GROUP BY DAILY.qid
`;

const waitForAthenaExecution = async (executionId: string) => {
  // wait for execution complete
  while (true) {
    const execution = await client
      .getQueryExecution({
        QueryExecutionId: executionId,
      })
      .promise();

    // RUNNING or QUEUED
    if (execution.QueryExecution?.Status?.State === 'RUNNING' || execution.QueryExecution?.Status?.State === 'QUEUED') {
      console.info('Athena query waiting...');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      continue;
    }

    // FAILED or CANCELLED
    if (
      execution.QueryExecution?.Status?.State === 'FAILED' ||
      execution.QueryExecution?.Status?.State === 'CANCELLED'
    ) {
      console.error(execution.QueryExecution);
      throw new Error('Athena excution has errors.');
    }

    // SUCCEEDED
    break;
  }
};

// 理科、社会の６年グループのIDs
const getGradeSixGroups = async (): Promise<string[]> => {
  const groups = (
    await DBHelper().scan<Tables.TGroups>({
      TableName: Environments.TABLE_NAME_GROUPS,
      FilterExpression: '#grade = :grade',
      ExpressionAttributeNames: {
        '#grade': 'grade',
      },
      ExpressionAttributeValues: {
        ':grade': '6',
      },
    })
  ).Items.filter(
    (item) => item.subject === SUBJECT.SCIENCE.toString() || item.subject === SUBJECT.SOCIETY.toString()
  ).map((item) => item.id);

  return groups;
};
