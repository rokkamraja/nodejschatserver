/*
 * FileName: Config.js
 * Author: Raja
 * Date: August 12th, 2012
 * Time: 2:55 PM
 * Description: This is the config file where all the required global
 *               variables and constants reside as functions.
 */



/*
 * Central Config file.
 */

serverPort = 10001;
maxServerConnections = 1000;

redisPort = 6379;
redisHost = '127.0.0.1';

helpString = " supported \n" +  
"1) TCP server listening to port 10001 \n" +  
"2) Multiple clients can login. \n" + 
"3) Clients are assigned random user names. \n" +
"4) Clients can create their own user name \n" +
"5) Persistence, (All chat messages are stored using Redis) \n" +
"6) Winston logging framework integrated. \n" + 
"7) Support for custom commands for Clients. \n" +
 "   You have to enter @cmds to enter command execution mode. \n" +
  "    Currently supports only 4 commands \n" +
   "     about - about the server \n" +
    "    users - list of all users in the chat room \n" +
     "   count - number of users in chat room \n" +
      "  quit - quit the command prompt. \n" +
"8) Chat filtering of bad words \n" +
"9) Centralized exception handling. \n" +
"10) When client exits the chat server informs other clients about the \n " + "departure.\n";

exports.maxServerConnections = maxServerConnections;
exports.serverPort = serverPort;
exports.redisPort = redisPort;
exports.redisHost = redisHost;

exports.helpString = helpString;