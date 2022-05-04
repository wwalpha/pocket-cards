# pocket-cards-frontend

## Models

| Domain | Variable    | Type                    | Default   | Description                  |
| ------ | ----------- | ----------------------- | --------- | ---------------------------- |
| App    | isLoading   | boolean                 | false     | loading status               |
| App    | tabIndex    | number                  | 11        | active tab index             |
| App    | userInfo    | CognitoUser             | undefined | logined user infomations     |
| App    | groupId     | string                  | ''        | active group id              |
| App    | status      | string                  | STOPPED   | ECS service status           |
| App    | displayCtrl | Record<number, boolean> | {}        | Display controller           |
| Group  | groupsInfo  | Tables.TGroups[]        | []        | User's all group infomations |
| Group  | dataRows    | Tables.TGroups[]        | []        | Group word list              |
| Group  | regists     | Tables.TGroups[]        | []        | New words list for regist    |
