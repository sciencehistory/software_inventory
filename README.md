# Science History Instite software inventory

Our sofware inventory is an internal website to help us track which Institute colleagues are using what software.

## Installation

This is a Drupal 9 site. To create a dev environment, you will need Composer, Drush, an Apache server, PHP >=7.3, and MySQL. (All these are easy to install via Brew, if you are working on a Mac.)

This setup is largely taken from  https://matti.dev/post/setup-install-drupal-9-with-composer-and-drush. It is not guaranteed to work (this is an internal website) but may save you some time.

Make sure you have a copy of the production database on hand at:

software_inventory_from_production.sql;

Create an empty Drupal project:
```
composer create-project drupal/recommended-project software_inventory
cd software_inventory
composer require drush/drush:^10
```
Create an empty MySQL database named chemheri_software_inventory:


```
CREATE DATABASE chemheri_software_inventoryCHARACTER SET utf8mb4COLLATE utf8mb4_unicode_ci;
Create a new MySQL user and password that has admin rights for your new database.
CREATE USER chemheri_software_inventory@localhostIDENTIFIED BY [SOME_PASSWORD];GRANT SELECT, INSERT, UPDATE, DELETE, CREATE,DROP, INDEX, ALTER, CREATE TEMPORARY TABLESON chemheri\_software\_inventory.* TO'chemheri_software_inventory'@'localhost';
FLUSH PRIVILEGES;show grants for 'chemheri_software_inventory'@'localhost';
```
Back on the command line:

```
drush site-install standard  --db-url='mysql://chemheri_software_inventory:[DB_PASS]@localhost:3306/chemheri_software_inventory' --account-name=[ADMIN_USER] --account-pass=[ADMIN_PASSWORD]  --site-name=software_inventory  --site-mail=you@sciencehistory.org
```
Set up your Git sandbox:

```
git clone   web2sudo rsync -avz  web2/  web/rm -rf web2
chmod -R 777 web/sites/default/files/
```

At this point, your apache server should see a rudimentary Drupal site.

Copy down the production database:

```
drop database chemheri_software_inventory;create database chemheri_software_inventory  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;use chemheri_software_inventory;source software_inventory_from_production.sql;
```
Clear the cache:

```
drush cr
```
Now point your Apache server at the web directory. You should see the site.

You may want to write a script or two to automate copying up and down the files and the code from a2.

### Gotcha: MySQL collation

Mac MySQL default collation is `utf8mb4_0900_ai_ci`

Ubuntu MySQL default collation is `utf8mb4_unicode_ci`.

You may wish to run `sed -i ''  's/utf8mb4_0900_ai_ci/utf8mb4_unicode_ci/g' database.sql` or vice-versa when moving betwee