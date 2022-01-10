CREATE TABLE "chefs" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "file_id" int NOT NULL
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "path" text NOT NULL
);

CREATE TABLE "recipes" (
  "id" SERIAL PRIMARY KEY,
  "chef_id" int NOT NULL,
  "user_id" int NOT NULL,
  "title" text NOT NULL,
  "ingredients" text [] NOT NULL,
  "preparation" text [] NOT NULL,
  "information" text NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "recipe_files" (
  "id" SERIAL PRIMARY KEY,
  "recipe_id" int NOT NULL,
  "file_id" int NOT NULL
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "reset_token" text,
  "reset_token_expires" text,
  "is_admin" boolean DEFAULT false,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

ALTER TABLE
  "chefs"
ADD
  CONSTRAINT chefs_file_id_fkey FOREIGN KEY ("file_id") REFERENCES "files" ("id");

ALTER TABLE
  "recipes"
ADD
  CONSTRAINT recipes_chef_id_fkey FOREIGN KEY ("chef_id") REFERENCES "chefs" ("id") ON DELETE CASCADE;

ALTER TABLE
  "recipes"
ADD
  CONSTRAINT recipes_user_id_fkey FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE
  "recipe_files"
ADD
  CONSTRAINT recipe_files_recipe_id_fkey FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id") ON DELETE CASCADE;

ALTER TABLE
  "recipe_files"
ADD
  CONSTRAINT recipe_files_file_id_fkey FOREIGN KEY ("file_id") REFERENCES "files" ("id") ON DELETE CASCADE;

/* SESSION */
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
) WITH (OIDS = FALSE);

ALTER TABLE
  "session"
ADD
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

/* END SESSION */
/* CREATE PROCEDURE */
CREATE FUNCTION trigger_set_timestamp() RETURNS TRIGGER AS $ $ BEGIN NEW.updated_at = NOW();

RETURN NEW;

END $ $ LANGUAGE plpgsql;

-- AUTO recipes.updated_at
CREATE TRIGGER trigger_set_timestamp BEFORE
UPDATE
  ON recipes FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- AUTO users.updated_at
CREATE TRIGGER trigger_set_timestamp BEFORE
UPDATE
  ON users FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

/* END CREATE PROCEDURE */