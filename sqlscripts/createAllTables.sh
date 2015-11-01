#!/bin/bash

#create the three required tables into an sql database
#db_name should be the first argument of the script

mysql -u root -pSynetiq1234 $1 < createRecordsUsers.sql;
mysql -u root -pSynetiq1234 $1 < createVideoTable.sql;
mysql -u root -pSynetiq1234 $1 < createRecordsTable.sql;
