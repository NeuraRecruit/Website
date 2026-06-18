create table if not exists admin_login_attempts (
  ip           text primary key,
  attempts     int not null default 0,
  locked_until timestamptz
);
