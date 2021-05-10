import { DBHelper } from '../ecs/utils';
import { Words } from '../ecs/queries';
import { Environment } from '../ecs/consts';
import { API, Table } from 'typings';

const start = async () => {
  const master = (
    await DBHelper().scan({
      TableName: Environment.TABLE_WORD_MASTER,
    })
  ).Items as Table.TWordMaster[];

  const words = (
    await DBHelper().scan({
      TableName: Environment.TABLE_WORDS,
    })
  ).Items as Table.TWords[];

  const tasks = words
    .map(
      (item) =>
        ({
          ...item,
          vocabulary: master.find((m) => m.id === item.id)?.vocJpn,
        } as Table.TWords)
    )
    .map((item) => DBHelper().put(Words.put(item)));

  await Promise.all(tasks);
};

start();
