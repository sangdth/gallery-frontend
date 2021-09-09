alter table "public"."pages" alter column "is_home" set default false;
alter table "public"."pages" alter column "is_home" drop not null;
alter table "public"."pages" add column "is_home" bool;
