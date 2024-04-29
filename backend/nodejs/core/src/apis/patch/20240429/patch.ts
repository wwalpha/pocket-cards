import { Environment } from '@consts';
import { WordMasterService } from '@services';
import { Commons, DBHelper } from '@utils';
import { Tables } from 'typings';

const patch = async (): Promise<void> => {

  const results = await DBHelper().scan<Tables.TWordMaster>({
    TableName: Environment.TABLE_NAME_WORD_MASTER,
  })

  const items = results.Items;
  const total = items.length;

  for(;;) {
    const item = items.pop();

    // not found
    if (item === undefined) break;

    const key = await Commons.saveWithMP3(item.id);

    await WordMasterService.update({
      ...item,
      mp3: key,
    })

    console.log(`Count: ${items.length}/${total}`);
  }
};

export default patch;

patch();
