Date: August 12th, 2012

This is a chat server created using Node.js.

:: INSTALL ::
1. Install node.js
2. Install redis server 
3. Do - npm install winston
4. and in source do - npm link winston
5. install redis client - npm install -g redis 
6. In the source directory do - npm link redis 
7. Finally, install nodeunit - npm install -g nodeunit

:: USAGE ::
1.) cd src
2.) node IRCMain.js

Clients 
1.) telnet <ip address of server> 10001

:: FEATURES ::
1) TCP server listening to port 10001
2) Multiple clients can connect using telnet or netcat.
3) Clients are assigned random user names.
4) Clients can create their own user name
5) Persistence, (All chat messages are stored using Redis)
6) Winston logging framework integrated.
7) Support for custom commands for Clients.
      Currently supports only 3 commands
        about
        users
        count
        quit
8) Chat filtering of bad words
9) Centralized exception handling.
10) When client exits the chat server informs other clients about the departure.

