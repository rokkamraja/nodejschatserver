/*
 * FileName: IRCMain.js
 * Author: Raja
 * Date: August 12th, 2012
 * Time: 2:30 PM
 * Description: This is the main file from which the server and entire
 *              control flow of server starts.
 */


var ircServer = require("./server/IrcServer");

ircServer.start();
