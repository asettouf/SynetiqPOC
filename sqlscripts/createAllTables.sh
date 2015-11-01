#!/bin/bash

#create the three required tables into an sql database
#Using full path to my project to avoid having to be in the directory to execute
#the script


#username should be the first argument of the script
#db_name should be the second argument of the script

path="$HOME/Projects/SynetiqTest/sqlscripts";

mysql -u $1 -p $2 < "$path/createAllTables.sql";
