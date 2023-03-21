declare module '*.json' {
  const value: any;
  export default value;
}

export interface GroupInfo {
  id: string;
  name: string;
  description?: string;
}

export namespace DynamoDBOptions {
  interface Put {
    ReturnValues: 'NONE' | 'ALL_OLD' | 'UPDATED_OLD' | 'ALL_NEW' | 'UPDATED_NEW' | string;
  }
}

export interface VisionRequest {
  content: string;
  language: string;
}

export type VisionResponse = string[];

export interface ENVIRONMENTS {
  DYNAMODB_TABLES: {
    USERS: string;
    GROUPS: string;
    WORDS: string;
    HISTORY: string;
    WORD_MASTER: string;
  };
  S3_BUCKETS: {
    AUDIOS: string;
    IMAGES: string;
  };
  WORDS_LIMIT: string;
  PATH_PATTERN: string;
}

export interface WSSConnectionEvent {
  domainName: string;
  principalId: string;
  connectionId: string;
  stage: string;
}
