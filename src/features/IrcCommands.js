/*
 * FileName: IrcCommands.js
 * Author: Raja
 * Date: August 12th, 2012
 * Time: 4:15 PM
 * Description: This is the file which implements all the irc commands implemented for user.
 */



function about()
{
	var txt = "Chitika NodeJs IRC Chat Server 1.0\nAuthor: Raja R\n";
	return txt;
}

function listUsers( allUsers )
{
	var userNames = "";
	for(var i = 0; i<allUsers.length; i++)
	{
		userNames = "> " + allUsers[i].username + "\n";
	}
	
	return userNames;
}

function countUsers( allUsers )
{
    var i = allUsers.length;
   // console.log( " Value of i = " + i );
	var userNames = "> Count of Users connected = " + i + "\n";
	return userNames;
}

exports.about = about;
exports.listUsers = listUsers;
exports.countUsers = countUsers;
