import { Entity, DisplayType, Status } from './enums';

export type NavItem = {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
  path?: string;
};

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends Record<string, unknown>
      ? RecursivePartial<T[P]>
      : T[P];
};

export type AggregateData<T, K extends string> = Record<
  `${Lowercase<K>}_aggregate`, { nodes: T[] }
>;
export type SingleData<T, K extends string> = Record<
  `${Lowercase<K>}_by_pk`, T
>;
export type InsertedData<T, K extends string> = Record<
  `insert_${Lowercase<K>}_one`, T
>;
export type DeletedData<T, K extends string> = Record<
  `delete_${Lowercase<K>}_by_pk`, T
>;

export type BaseType = {
  id: string;
  created_at: string | Date;
  updated_at: string | Date;
  user_id: string;
  status: Status;
};

export type SiteType = BaseType & {
  name: string;
  slug: string;
  description: string | null;
};

export type Image = BaseType & {
  meta: string;
  path: string;
  collection_id: string;
};

export type PageType = BaseType & {
  name: string;
  slug: string;
  content: string | null;
  site_id: string;
};

export type CollectionType = BaseType & {
  name: string | null;
  description: string | null;
  site_id: string;
  type: DisplayType;
  images: Image[];
};

export type CollectionInput = RecursivePartial<
  Pick<CollectionType, 'id' | 'name' | 'description' | 'images' | 'status' | 'type' | 'site_id'>
>;

export type AccountType = Exclude<BaseType, 'status'> & {
  active: boolean;
  email: string | null;
  new_email: string | null;
  password_hash: string | null;
  default_role: string;
  is_anonymous: boolean;
  custom_register_data: string | null;
  opt_secret: string | null;
  mfa_enabled: boolean;
  ticket: string;
  ticket_expires_at: string | Date;
};

export type UserType = Exclude<BaseType, 'user_id' | 'status'> & {
  display_name: string | null;
  avatar_url: string | null;
  account: AccountType;
};

export type SitesAggregateData = AggregateData<SiteType, Entity.Sites>;
export type SiteData = SingleData<SiteType, Entity.Sites>;
export type SiteInsertedData = InsertedData<SiteType, Entity.Sites>;
export type SiteDeletedData = DeletedData<SiteType, Entity.Sites>;

export type PagesAggregateData = AggregateData<PageType, Entity.Pages>;
export type PageData = SingleData<PageType, Entity.Pages>;
export type PageInsertedData = InsertedData<PageType, Entity.Pages>;
export type PageDeletedData = DeletedData<PageType, Entity.Pages>;

export type CollectionsAggregateData = AggregateData<CollectionType, Entity.Collections>;
export type CollectionData = SingleData<CollectionType, Entity.Collections>;
export type CollectionInsertedData = InsertedData<CollectionType, Entity.Collections>;
export type CollectionDeletedData = DeletedData<CollectionType, Entity.Collections>;
