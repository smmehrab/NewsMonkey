# News Monkey

A personal fun project for the sake of automating daily news fetching from **Hacker News**. 

**News Monkey** run as a service in background, on Windows & Unix Os and fetches current date's news from '[https://hckrnews.com/](https://hckrnews.com/)' and sort them based on their points. And send **Top 5 Hacker News** to your given email every day, at a specific time (also provided by you). 

> **Note:** But as it run as a OS service, you won't receive its feature when your PC or your INTERNET CONNECTION isn't active. So, if your PC or INTERNET CONNECTION isn't active at that specific time, you won't get any emails.

## Set Up Procedure

Make sure you have [nodejs](https://nodejs.org/en/download/) set up in your computer.

**SET UP YOUR MONKEY**

You may want to create a additional gmail address (Or use the gmail account that you don't use officially), because the software will need that to serve as the bot (To send you the mails). Let's call that email as **monkeyEmail**, that email's password as **monkeyEmailPassword** & the email to which the news will be sent,  as **receiverEmail** (I am not kidding). Let's call the time to send email, as newsTime (**24 Hour Format**, consisting of **newsHour** & **newsMinute**.

For **monkeyEmail**, do the followings -
- Google Account > Security > Less Secure App Access 
- Turn It On
> **Note:** Otherwise google will not give permission to let this software use that email.

### Windows

> **Note:** Hope, you don't mind hitting lots of YESs when windows will continuously ask you for user control permissions. Microsoft likes no monkeys.

- Installation
	- Method 1
	 
		 Click on the **installOnWindows.bat** file which will automatically run the installation scripts for you and ask you for **monkeyEmail**, **monkeyEmailPassword**, **receiverEmail**, **newsHour** & **newsMinute** via cmd. Enter the those three fields correctly and you are good to go!
		 
		 > **Note:** Later on, you can rewrite configure.txt file if you want to change any of these.
		 
	- Method 2 
	
		Open configure.txt file and follow the given syntax to write to it -
		```javascript
			monkeyEmail monkeyEmailPassword receiverEmail newsHour newsMinute
		```
		
		Open the command prompt and navigate to the project directory.
		Run the following commands on command prompt - 
	
		```javascript
			npm install 
			node installOnWindows.js
		```
		And you are good to go!
		

### Linux

Open configure.txt file and follow the given syntax to write to it -
```javascript
	monkeyEmail monkeyEmailPassword receiverEmail newsHour newsMinute
```

Open the terminal and navigate to the project directory.
		Run the following commands on terminal - 
	
```javascript
	npm install 
	node installOnLinux.js
```
And you are good to go!

### Edit Configuration

You can rewrite the **config.txt** file anytime following the given syntax -
```javascript
	monkeyEmail monkeyEmailPassword receiverEmail newsHour newsMinute
```

However, you **must restart the service** after rewriting configuration via running following commands -
	
```javascript 
	Windows	: 	node restartOnWindows.js 
	Linux	:	node restartOnLinux.js
```
Moreover, you may just click **restartOnWindows.bat** file if you are on windows.

### Uninstall

Open the terminal and navigate to the project directory.
		Run the following commands on terminal - 
	
```javascript	
	Windows	:	node uninstallOnWindows.js
	Linux	:	node uninstallOnLinux.js
```
Or you can just click on **uninstallOnWindows.bat** if you are on windows.