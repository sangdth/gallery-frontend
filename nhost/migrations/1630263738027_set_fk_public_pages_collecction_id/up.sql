alter table "public"."pages"
  add constraint "pages_collecction_id_fkey"
  foreign key ("collecction_id")
  references "public"."collections"
  ("id") on update no action on delete no action;
