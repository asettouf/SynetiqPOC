#How to use this project

##Structure

* html folder for every html page and pcitures or videos to add
* javascripts folder contains Javascript files
* css folder contains css files
* php folder contains php files, and textfile with params to query the database
* sqlscripts folder contains a sql file to create the required table, and my bash script to do it automatically (almost still need database password to work)

##How it works

You need to have an Apache server, php and mysql installed on your computer
Depending on your Apache configuration, you might have to modify the var *phpTarget* in js files to access the php side on your environment. You might as well need to modify links in html pages if you have a different architecture

**TO DO** <br />
* You need to add a .dbparams file in your php folder with the right parameters to query the database, it should contain in this order: <br />
*servername* <br />
*username* <br />
*password* <br />
*database name* <br />

* You also need to create a videos folder to implement video (by default the video should be called video1.ogv) <br />

The user should have at least read access to the database

Please contact me in case of issues if you are to use this project: adonis.settouf@gmail.com
Please don't hesitate to use this project if you need inspiration in your work.
