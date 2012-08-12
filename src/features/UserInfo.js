/*
 * FileName: UserInfo.js
 * Author: Raja
 * Date: August 12th, 2012
 * Time: 4:30 PM
 * Description: This is userInfo file which essentially is the client information. The initial client ( aka username ) is set on first connect
 *               Remove users on disconnect and other user details are set. 
 *               This file is invoked from ServerActionListener
 */

// Main class which will hold user details
function userDetail()
{
	this.username;     // username, by default they are called "Guest_<random number>"
	this.status;       // this will specifcy in which state a user is in. "connected", "data", "command".
	this.userSocket;   // each user will have their own TCP socket. This is how we distinguish between users.
	this.joinTime;     //useful but currently not used anywhere.
	this.dataText;     // text to be displayed
	this.messageFor;   // who will see the message. certain messages from server are not seen by all.
};


/*
* This is what is called when user first connects.
* Their status is set to connected and they are assigned a random username.
*/
function onConnect( arrParameter )
{
	var varUserDetail = new userDetail();
	varUserDetail.userSocket = arrParameter[0];
	varUserDetail.joinTime = new Date();
	varUserDetail.status = "connected";
	varUserDetail.username = "Guest_"+Math.round((Math.random() * 100));

	return varUserDetail;
}

/* Normal chat messages are redirected here
* 
*/
function onData( arrParameter )
{
	var data = arrParameter[0];
	//data = data.substring(0, data.length-1);
	var socket = arrParameter[1];
	allUsers = arrParameter[2];
	//console.log("num of users " + allUsers.length);

	return parseDataString( data , socket , allUsers );
}

/*
* When a user quits, control comes here. 
* These users are subsequently removed from the master list.
*/
function onClose( arrParameter )
{
	var socket = arrParameter[0];
	allUsers = arrParameter[1];

	return removeUser( socket, allUsers );
}

function removeUser( socket, allUsers )
{
        for( var i = 0; i < allUsers.length; i++ )
        {
                if( allUsers[i].userSocket == socket )
                {
			var varUserName = allUsers[i].username;
			console.log("user_detail removeUSer varUSerName:" + varUserName);
			allUsers.splice(i,1);
			 console.log("user_detail removeUSer varUSerName:" + varUserName);
			return varUserName;
			break; 
		}
	}	
}

function setConnectedUserDetail( data , varUserDetail )
{
	varUserDetail.status = "data";
	data = "" + data;
	data = data.substring( 0 , data.length-2 );
	if( data.trim() != "" )
	{
		varUserDetail.username = data;
	}
	varUserDetail.dataText = varUserDetail.username + " has joined the chat room.\n";
	varUserDetail.messageFor = "all";

	return varUserDetail;
}

/*
* Identifies whether it is a normal chat message, or a command to invoke the command center
* In the command center a user should be able to do different config operations
*/
function setDataUserDetail ( data , varUserDetail )
{	
	var str = data;
		var firstWord = data + "";
		firstWord = firstWord.substring(0, firstWord.length-2);
		if( firstWord == "@cmds" )
		{
			//this is a char server command. parse it, execute it only for the user.
			
			varUserDetail.status = "command";
                        varUserDetail.dataText = ">"
                        varUserDetail.messageFor = "self";
		}
		else if( firstWord == "/help" )
		{
			varUserDetail.status = "data";
			varUserDetail.dataText = data
			varUserDetail.messageFor = "help";
		}
		else
		{
			//this is normal text which everyone can see.
			
			varUserDetail.status = "data";
			varUserDetail.dataText = data
			varUserDetail.messageFor = "all";
		}
		return varUserDetail;
}

function parseDataString(data , socket, allUsers )
{
	for( var i = 0; i < allUsers.length; i++ )
	{
		if( allUsers[i].userSocket == socket )
		{	 //console.log("onData : Came here :Status " + varUserDetail.status);
			var varUserDetail = allUsers[i];
			if( varUserDetail.status == "connected" )
			{
				return setConnectedUserDetail( data , varUserDetail);
				break;
			}
			else if ( varUserDetail.status == "data" )
			{
				return setDataUserDetail ( data , varUserDetail );
				break;
			}
			
		}
	}
	
}

exports.onConnect = onConnect;
exports.onData = onData;
exports.onClose = onClose;
