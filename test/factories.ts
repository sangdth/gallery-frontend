import { Factory } from 'rosie';
import { v4 as uuidv4 } from 'uuid';
import { lorem } from 'faker';
import { Status, OptionKey } from '@/lib/enums';
import type { PageType, MenuOption, OptionValue } from '@/lib/types';

const baseAttributes = {
  id: () => uuidv4(),
  created_at: () => new Date(),
  updated_at: () => new Date(),
  user_id: () => uuidv4(),
  status: Status.Public,
};

export const PageFactory = new Factory<PageType>()
  .sequence('name', (i) => `Page ${i}`)
  .sequence('slug', (i) => `page-${i}`)
  .attrs(baseAttributes)
  .attrs({ content: 'test page' });

export const MenuValueFactory = new Factory<OptionValue>()
  .sequence('label', (i) => `${lorem.words()} ${i}`)
  .sequence('slug', (i) => `${lorem.slug()}-${i}`)
  .attrs({
    id: () => uuidv4(),
    children: [],
  });
  
export const MenuFactory = new Factory<MenuOption>()
  .attrs(baseAttributes)
  .attrs({
    site_id: () => uuidv4(),
    key: OptionKey.Menu,
    value: () => MenuValueFactory.buildList(5, {
      children: (() => MenuValueFactory.buildList(3))(),
    }),
  });
