export const Environments = {
  ENDPOINT_USERS_SERVICE: process.env.ENDPOINT_USERS_SERVICE as string,
  TABLE_NAME_SETTINGS: process.env.TABLE_NAME_SETTINGS as string,
};

export const API_URLs = {
  LookupUser: (username: string) => `${Environments.ENDPOINT_USERS_SERVICE}/users/pool/${username}`,
};
