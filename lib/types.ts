import { Entity, Status } from './enums';

export type NavItem = {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
  path?: string;
};

export type AggregateData<T, K extends string> = Record<
  `${Lowercase<K>}_aggregate`, { nodes: T[] }
>;

export type SingleData<T, K extends string> = Record<
  `${Lowercase<K>}_by_pk`, T
>;

export type BaseType = {
  id: string;
  created_at: string | Date;
  updated_at: string | Date;
};

export type SiteType = BaseType & {
  name: string;
  slug: string;
  description: string | null;
  user_id: string;
  status: Status;
};

export type AccountType = BaseType & {
  user_id: string;
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

export type UserType = BaseType & {
  display_name: string | null;
  avatar_url: string | null;
  account: AccountType;
};

export type SitesAggregateData = AggregateData<SiteType, Entity.Sites>;
export type SiteInsertedData = { insert_sites_one: SiteType };
export type SiteDeletedData = { delete_sites_by_pk: SiteType };
