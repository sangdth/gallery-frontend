import { Status } from './enums';

export type AggregateData<T, K extends string> = Record<
  `${Lowercase<K>}_aggregate`, { nodes: T[] }
>;

export type SingleData<T, K extends string> = Record<
  `${Lowercase<K>}_by_pk`, T
>;

export type SiteType = {
  id: string;
  created_at: string | Date;
  updated_at: string | Date;
  name: string;
  slug: string;
  description: string | null;
  user_id: string;
  status: Status;
};
