/*
 * FileName: IrcCommandController.js
 * Author: Raja
 * Date: August 12th, 2012
 * Time: 3:45 PM
 * Description: This is the file which decides what commands to execute and 
 *               how to handle unknown commands.
 */



var commands = require("./IrcCommands");
function onData( arrParameter )
{
    var data = arrParameter[0];
    var socket = arrParameter[1];
    allUsers = arrParameter[2];
	return parseCommandString( data , socket , allUsers );
}

function parseCommandString ( data, socket, allUsers )
{
	var command = data + "";
	command = command.substring( 0 , command.length - 2 );
	
	if( command == "about" )
	{
		var varUserDetail = getUser( socket, allUsers );
		return processAboutCommand( varUserDetail );
	}
	else if( command == "users")
	{
		var varUserDetail = getUser( socket, allUsers );
		return processListUsersCommand( varUserDetail , allUsers );
	}
	else if( command == "count" )
	{
		var varUserDetail = getUser( socket, allUsers );
        return processCountUsersCommand( varUserDetail, allUsers );

	}
    else if( command == "quit" )
	{
		var varUserDetail = getUser( socket, allUsers );
        return processQuitCommand( varUserDetail );

	}
	else
	{
        var varUserDetail = getUser( socket, allUsers );
        return processUnknownCommand( varUserDetail );
	}
}

function processAboutCommand( varUserDetail )
{
    varUserDetail.messageFor = "self";
    varUserDetail.dataText = commands.about() + ">";
	varUserDetail.status = "command";
	return varUserDetail;
}

function processListUsersCommand ( varUserDetail, allUsers )
{
	varUserDetail.messageFor = "self";
	varUserDetail.dataText = commands.listUsers( allUsers ) + ">";
	varUserDetail.status = "command";
	return varUserDetail;
}

function processCountUsersCommand ( varUserDetail, allUsers )
{
	varUserDetail.messageFor = "self";
	varUserDetail.dataText = commands.countUsers( allUsers ) + ">";
	varUserDetail.status = "command";
	return varUserDetail;
}


function processQuitCommand( varUserDetail )
{
        varUserDetail.messageFor = "all";
        varUserDetail.dataText = "\n";
        varUserDetail.status = "data";
        return varUserDetail;

}

function processUnknownCommand( varUserDetail )
{
    varUserDetail.messageFor = "self";
    varUserDetail.dataText = "unknown comman\n>";
    varUserDetail.status = "command";
    return varUserDetail;

}


function getUser( socket, allUsers )
{
	for( var i = 0; i < allUsers.length; i++ )
        {
		var varUserDetail = allUsers[i];
                if( varUserDetail.userSocket == socket )
                {
			return varUserDetail;
			break; 
		}
	}
}

exports.onData = onData;
