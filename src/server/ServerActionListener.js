/*
 * FileName: ServerActionListener.js
 * Author: Raja
 * Date: August 12th, 2012
 * Time: 3:00 PM
 * Description: All Server Requests are handled by this file. All files and their methods are pre loaded onto arrays.               
 */

// These are set of files to which the call has to go to.
var userDetail = require("./../features/UserInfo");
var commandCenter = require("./../features/IrcCommandController");

// These are the associated methods which will handle the call.
var userDetailHandler = [];
userDetailHandler["onConnect"] = userDetail.onConnect;
userDetailHandler["onData"] = userDetail.onData;
userDetailHandler["onClose"] = userDetail.onClose;

var commandCenterHandler = [];
commandCenterHandler["onData"] = commandCenter.onData;


function listenAction( listenerObject )
{
	var actionFile = listenerObject.action ;
	var methodNm = listenerObject.methodname;
	var arrParameter = listenerObject.arrparameter;
	var varUserDetail = choseAction( actionFile, methodNm, arrParameter );
	return varUserDetail;
}

function choseAction(actionFile, methodNm, arrParameter)
{
	if(actionFile == "userInfo")
	{	
		var varUserDetail = userDetailHandler[methodNm](arrParameter);
		return varUserDetail;
	}
	else if( actionFile = "ircCommandCenter" )
	{
		var varUserDetail = commandCenterHandler[methodNm](arrParameter);
		return varUserDetail;
	}
}

exports.listenerAction = listenAction;


