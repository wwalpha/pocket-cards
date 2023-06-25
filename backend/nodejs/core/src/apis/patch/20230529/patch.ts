import { Environment } from '@consts';
import { LearningService } from '@services';
import { DBHelper } from '@utils';

const patch = async (): Promise<void> => {
  const userId = 'Google_109439805128280065775';
  const groupIds: string[] = [
    // 'prxVGZqu7DRxc5NbsdL4fe',
    // '9RVTL6Dnu8dGX7pCrw78Ch',
    // '8GFEsYJpUwV7LBqwam8PVG',
    // 'kFwkNYMdvjQRSQk1zSKa8n',
    // '2mdnowcjRGrEbEYg3CQ6Rr',
    // '9w83Jg9ktHxEBQe8uBnhLk',
    // '6gns3mGJxupAwUsZJXn44o',
    // 'xdCeUT337zFLUecrVLR7RV',
    // '2gMRKmfHtfin7YZoxpSPfm',
    // '8ZxP81wBXY7Adk11Z4X2rH',
    // 'btWiokeG73MG5kzp1TT1KN',
    // 'dZACfunCvdv5EVDb9uG3jD',
    // 'iyPV3R4qYrLAFcpYRTgYUT',
    // 'tnTayZAEQrTKUGgjQzhFn4',
    // 'dRg2PRzSsGcxYjmE6xwSJM',
    // '4rhXG7wdW62i7nvhfWL2PT',
    // 'iebWhBkteq1YVuq9gn4EiM',
    // '75qu5tFWD3GCoxPaDY6krS',
    // 'bmQu4PZ2M1zXhtvcSQJuXQ',
    'mAmMBcYQxU3d3pf8qH91a8',
    'i4yGTSfQjQjUe7jMCA7kvR',
    '5GbLSRFj5L9zLjVzygZt1R',
    'b2kfjNJSLf4Xo4F4aqNELQ',
  ];

  for (;;) {
    const groupId = groupIds.pop();

    if (!groupId) {
      break;
    }

    const learnings = await LearningService.listByUser(userId, groupId);

    const items = learnings
      .filter((item) => item.times < 3)
      .map((item) => ({
        ...item,
        times: 3,
      }));

    await DBHelper().bulk(Environment.TABLE_NAME_LEARNING, items);
  }
};

patch();
