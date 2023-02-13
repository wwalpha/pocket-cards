import { Accuracy } from '@queries';
import { DBHelper } from '@utils';
import { Athena } from 'aws-sdk';
import moment from 'moment';
import { AccuracyRow } from 'typings';

const client = new Athena({
  region: process.env['AWS_DEFAULT_REGION'],
});

export default async () => {
  // now
  const timestamp = moment().add(-1, 'days').format('YYYYMMDD');
  const userId = 'Google_109439805128280065775';

  const query = `
  WITH 
    COUNTED AS (
      SELECT item.qid as qid,
        (
          CASE
            WHEN "item"."timesafter" > "item"."timesbefore" then 1 else 0
          END
        ) AS correct
      FROM "pkc"."learningtrace"
      WHERE item.userid = '${userId}'
        AND item.timesbefore <> 0
        AND item.subject IN ('2', '3')
    ),
    DAILY AS (
      SELECT item.qid as qid
      FROM "pkc"."learningtrace"
      WHERE item.userid = '${userId}'
        AND item.timesbefore <> 0
        AND item.subject IN ('2', '3')
        AND item."timestamp" > '${timestamp}'
    )
  SELECT DAILY.qid,
    (
      CAST(sum(correct) AS decimal(7, 4)) / CAST(count(*) AS decimal(7, 4)) * 100
    ) AS percent
  FROM COUNTED, DAILY
  WHERE COUNTED.qid = DAILY.qid
  GROUP BY DAILY.qid
  `;

  // start query
  const { QueryExecutionId } = await client
    .startQueryExecution({
      QueryString: query,
    })
    .promise();

  // validation
  if (!QueryExecutionId) throw new Error('Athena excution has errors.');

  // wait for execution complete
  while (true) {
    const execution = await client
      .getQueryExecution({
        QueryExecutionId: QueryExecutionId,
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
      throw new Error('Athena excution has errors.');
    }

    // SUCCEEDED
    break;
  }

  const results = await client
    .getQueryResults({
      QueryExecutionId: QueryExecutionId,
    })
    .promise();

  const originRows = results.ResultSet?.Rows;

  // no results
  if (!originRows) return;

  // fix datas
  const dataRows = originRows
    .map<AccuracyRow | undefined>((item) => {
      if (!item.Data || item.Data.length !== 2) return undefined;

      const qid = item.Data[0].VarCharValue;
      const accuracy = item.Data[1].VarCharValue;

      return {
        qid,
        accuracy: Number(accuracy),
      };
    })
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  // create update sql
  const tasks = dataRows.map((item) =>
    DBHelper().put(
      Accuracy.put({
        qid: item.qid!,
        uid: userId,
        accuracy: item.accuracy!,
      })
    )
  );

  // update accuracy
  await Promise.all(tasks);
};
