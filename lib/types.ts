import type { Layouts as GridLayouts } from 'react-grid-layout';

import {
  DisplayType,
  Entity,
  OptionKey,
  Position,
  SectionElement,
  Status,
} from './enums';

export type Tag = {
  type: string;
  id: string;
};

export type DomSectionElement = {
  id: SectionElement;
  name: string;
  isDragged: (id: SectionElement) => boolean,
  onClick: (id: SectionElement) => void,
  component: JSX.Element | ((id: SectionElement)  => JSX.Element),
};

export type Folder = {
  id: string;
  label: string;
  slug: string;
  description: string;
};

export type StorageResponse = {
  AcceptRanges: string;
  ContentLength: number;
  ContentType: string;
  ETag: string;
  LastModified: string;
  Metadata: {
    token: string;
  };
  key: string;
};

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

export type BaseType = {
  id: string;
  created_at: string | Date;
  updated_at: string | Date;
  user_id: string;
  status: Status;
};

export type BaseOption = BaseType & {
  site_id: string;
  key: OptionKey;
};

export type MenuOption = BaseOption & {
  key: OptionKey.Menu;
  value: OptionValue[];
};

export type StyleOption = BaseOption & {
  key: OptionKey.Style;
  value: OptionValue;
};

export type HomeOption = BaseOption & {
  key: OptionKey.Home;
  value: { id: string };
};

export type LayoutOption = BaseOption & {
  key: OptionKey.Layout;
  value: { id: string };
};

export type LogoOption = BaseOption & {
  key: OptionKey.Logo;
  value: { id: string; path: string | null; position: Position };
};

export type OptionValue = { [k: string]: string | number | boolean | null | OptionValue | OptionValue[] }
;

// TODO: This is bullshit
export type OptionType =
  | HomeOption
  | LayoutOption
  | LogoOption
  | MenuOption
  | StyleOption
;

export type MenuItemType = {
  id: string;
  label: string;
  slug: string;
  description: string;
  children: MenuItemType[];
};

export type DragItemType = {
  id: string;
  label: string;
  children: DragItemType[];
};

export type SiteType = BaseType & {
  name: string;
  slug: string;
  description: string | null;
  collections?: CollectionType[];
  layouts?: LayoutType[];
  options?: OptionType[];
  pages?: PageType[];
};

export type ImageType = BaseType & {
  name: string;
  meta: string;
  path: string;
  collection_id: string | null;
  description: string | null;
};

export type PageType = BaseType & {
  name: string;
  slug: string;
  content: string | null;
  site_id: string;
  collection_id: string | null;
  collection: CollectionType | null;
};

export type CollectionType = BaseType & {
  name: string | null;
  description: string | null;
  site_id: string;
  type: DisplayType;
  images: ImageType[];
};

export type LayoutValue = {
  [k: string]: string | number;
};
export type LayoutType = BaseType & {
  site_id: string;
  name: string;
  value: GridLayouts;
};

export type DataType = SiteType | PageType | CollectionType | ImageType | LayoutType | OptionValue;

export type ActionItemType = {
  id: string;
  name?: string;
  description?: string;
  children?: ActionItemType[];
};

export type CollectionPicked =
  | 'id'
  | 'name'
  | 'description'
  | 'images'
  | 'type'
  | 'site_id'
  | 'status';

export type PagePicked =
  | 'id'
  | 'name'
  | 'slug'
  | 'content'
  | 'collection_id'
  | 'collection'
  | 'status';

export type SitePicked =
  | 'id'
  | 'name'
  | 'description'
  | 'collections'
  | 'slug'
  | 'status';

export type LayoutPicked =
  | 'id'
  | 'name'
  | 'value'
  | 'status';

export type MakeInputType<T, K extends keyof T> = 
  RecursivePartial<Pick<T, K>> & { id: string };

export type CollectionInput = MakeInputType<CollectionType, CollectionPicked>;
export type PageInput = MakeInputType<PageType, PagePicked>;
export type SiteInput = MakeInputType<SiteType, SitePicked>;
export type LayoutInput = MakeInputType<LayoutType, LayoutPicked> & {
  value: GridLayouts;
};

export type DataInput = SiteInput | PageInput | CollectionInput;

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

export type Returning<T> = { returning: T[]; };
export type Aggregate<T> = { nodes: T[], aggregate: { count: number } };

export type AggregateData<T, K extends Entity> =
  Record<`${Lowercase<K>}_aggregate`, Aggregate<T>> & Record<`${Lowercase<K>}`, T[]>;
export type SingleData<T, K extends Entity> = Record<
  `${Lowercase<K>}_by_pk`, T
>;
export type InsertedData<T, K extends Entity> = Record<
  `insert_${Lowercase<K>}_one`, T
>;
export type DeletedData<T, K extends Entity> = Record<
  `delete_${Lowercase<K>}_by_pk`, T
>;
export type UpdatedData<T, K extends Entity> = Record<
  `update_${Lowercase<K>}`, Returning<T>
>;

export type UserData = SingleData<UserType, Entity.Users>;

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

export type ImageAggregatedData = AggregateData<ImageType, Entity.Images>;
export type ImageSingleData = SingleData<ImageType, Entity.Images>;
export type ImageInsertedData = InsertedData<ImageType, Entity.Images>;
export type ImageDeletedData = DeletedData<ImageType, Entity.Images>;

export type LayoutsAggregateData = AggregateData<LayoutType, Entity.Layouts>;
export type LayoutData = SingleData<LayoutType, Entity.Layouts>;
export type LayoutInsertedData = InsertedData<LayoutType, Entity.Layouts>;
export type LayoutDeletedData = DeletedData<LayoutType, Entity.Layouts>;

export type OptionUpdated = UpdatedData<OptionType, Entity.Options>;

export type EditingItem<T extends DataType> = {
  type: Entity;
  value: T;
  newValue: RecursivePartial<T>;
  error: string | string[] | null;
};

export type SiteEditingItem = EditingItem<SiteType>;
export type PageEditingItem = EditingItem<PageType>;
export type CollectionEditingItem = EditingItem<CollectionType>;

export type EditingItemType = SiteEditingItem | PageEditingItem | CollectionEditingItem;
