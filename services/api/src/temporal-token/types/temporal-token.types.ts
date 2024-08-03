export enum TemporalTokenEnum {
  'password_reset' = 'password_reset',
  'email_verification' = 'email_verification',
}

export type TemporalTokenType = keyof typeof TemporalTokenEnum;
