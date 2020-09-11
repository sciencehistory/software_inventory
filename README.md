# Science History Institue software inventory

Our sofware inventory is an internal website to help us track which Institute colleagues are using what software.

## Installation

This is a Drupal 9 site. This setup is largely taken from  https://matti.dev/post/setup-install-drupal-9-with-composer-and-drush. It assumes a basic knowledge of the Drupal ecosystem, and, considering how quickly Drupal changes, your mileage may vary.

### Requirements

1. Composer
2. Drush
3. Apache
4. PHP >= 7.3
5. MySQL

All these are easy to install via Brew, if you are working on a Mac.

### Preliminaries

Make sure you have a copy of the production database on hand at `software_inventory_from_production.sql`.

Create an empty Drupal project:
```
composer create-project drupal/recommended-project software_inventory
cd software_inventory
composer require drush/drush:^10
```

### Setting up the database

Create an empty MySQL database named chemheri_software_inventory, and a new MySQL user and password that has admin rights for your new database.

Note the default database will soon be deleted and replaced with the contents of `software_inventory_from_production.sql`.

```
CREATE DATABASE chemheri_software_inventory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER chemheri_software_inventory@localhost IDENTIFIED BY [SOME_PASSWORD];

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE,
DROP, INDEX, ALTER, CREATE TEMPORARY TABLES
ON chemheri\_software\_inventory.*
TO 'chemheri_software_inventory'@'localhost';

FLUSH PRIVILEGES;

show grants for 'chemheri_software_inventory'@'localhost';
```

Back on the command line:

```
drush site-install standard  \
--db-url='mysql://chemheri_software_inventory:[DB_PASS]@localhost:3306/chemheri_software_inventory' \
--account-name=[ADMIN_USER] \
--account-pass=[ADMIN_PASSWORD]  \
--site-name=software_inventory  \
--site-mail=you@sciencehistory.org
```

Set up your Git sandbox:

```
git clone   web2sudo rsync -avz  web2/  web/rm -rf web2
chmod -R 777 web/sites/default/files/
```

At this point, your Apache server should see a rudimentary Drupal site if you point it at the `web` directory.

### Drop the factory-installed database and replace it with a copy of the production database.

Make sure you have a copy of the production database on hand at `software_inventory_from_production.sql`.

```
drop database chemheri_software_inventory;
create database chemheri_software_inventory  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
use chemheri_software_inventory;
source software_inventory_from_production.sql;
```

Clear the cache:

```
drush cr
```
Now, if you point your Apache server at the web directory, you should see the site.

### Gotcha: MySQL collation

MySQL's default collation is different on MacOS and Ubuntu.

Mac: `utf8mb4_0900_ai_ci`
Ubuntu: `utf8mb4_unicode_ci`.

You may wish to run `sed -i ''  's/utf8mb4_0900_ai_ci/utf8mb4_unicode_ci/g' database.sql` or vice-versa when moving databases these two environments.