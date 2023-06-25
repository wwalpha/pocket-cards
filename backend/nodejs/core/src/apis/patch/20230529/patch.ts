import { Environment } from '@consts';
import { LearningService } from '@services';
import { DBHelper } from '@utils';

const patch = async (): Promise<void> => {
  const userId = 'Google_109439805128280065775';
  const groupIds: string[] = [
    'dCQ5K3mRsz8V3P89xTchNi',
    'oqTkMVDD78F385MhM5opae',
    '3spo3SvCqJPbRfL6oNNwm3',
    'dYeUDEMgGo2eUF3Fh6wKsJ',
    'jrbLD6auGbwqWLaJqFrHqh',
    'jtxUTDfgTtvvsxTzsyAZSb',
    '7BRoYDqotajKqVTHQYWKB4',
    'tSohQYaPt9oENcDzy6nNJ4',
    'vEdc8RcdZwn8ANwJV5saTR',
    'duB74CQa7vRccNMr3Jf4Mg',
    'tPRgKAjkDrd8C4J8KTPgRT',
    '76Lb8hBuCdBq2CXWnC1KJp',
    '2AqmCCDLrqJvp667SypckP',

    // 'uBoRxGMEvddTB1NbMDSNTa',
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
    // 'mAmMBcYQxU3d3pf8qH91a8',
    // 'i4yGTSfQjQjUe7jMCA7kvR',
    // '5GbLSRFj5L9zLjVzygZt1R',
    // 'b2kfjNJSLf4Xo4F4aqNELQ',
  ];

  for (;;) {
    const groupId = groupIds.shift();

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

    if (items.length === 0) {
      continue;
    }

    await DBHelper().bulk(Environment.TABLE_NAME_LEARNING, items);
  }
};

patch();
