#!/bin/bash

#create the three required tables into an sql database
#username should be the first argument of the script
#db_name should be the second argument of the script

path="$HOME/Projects/SynetiqTest/sqlscripts";

mysql -u $1 -p $2 < "$path/createUsersTableSQL.sql";
mysql -u $1 -p $2 < "$path/createVideoTable.sql";
mysql -u $1 -p $2 < "$path/createRecordsTable.sql";
