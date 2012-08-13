/*
 * FileName: IrcServer.js
 * Author: Raja
 * Date: August 12th, 2012
 * Time: 3:00 PM
 * Description: This is the server control file. New server is created at the start listening on the configured port.
 *              Whenever a client connects using telnet the onConnect method in the serverCallback function is called.
 *              Here the user connected can choose an username for himself and a corresponding listenerObject for all future
 *              actions on that socket would be created.
 */


/*
 * This is the heart of the Chat Server. We are using TCP server as a basis,   
 *   to receive calls.userInfo
 * Clients are generally Telnet or NetCat which where is appropriate.
 * Chat Server listens to inputs on port 10001.
 */
var net = require( "net" );
var config = require( "./../config/Config" );
var userInfo = require( "./../features/UserInfo" );
var serverActionListener = require( "./ServerActionListener" );
var centralizeErrorHandling = require( "./../utils/Control" );
var winston = require('winston');

winston.add(winston.transports.File, { filename: 'logs/chatLogging.log', level:'warn' });
winston.remove(winston.transports.Console);
//
// You can add a separate exception logger by passing it to `.handleExceptions`
//
winston.handleExceptions(new winston.transports.File({ filename: 'logs/exceptions.log' }))
  


var allUsers = [];
var filterWords = [ "fuck", "asshole", "suck", "sex"];
// "i" is to ignore case and "g" for global
var rgx = new RegExp(filterWords.join("|"), "gi");

function wordFilter(str) 
{          
        return String(str).replace(rgx, "****");           
}


var redis = require("redis");
var redisClient;
// create a redis connection
try
{
  redisClient = redis.createClient( config.redisPort, config.redisHost );
}
catch (err)
{
 console.log( "ERROR => Cannot connect to Redis message broker: URL => " + REDIS_URL + "; Port => " + REDIS_PORT );
 console.log(err);
}

 redisClient.on("error", function (err) {
        console.log("Redis Client Error " + err);
    });

function listenerObject()
{
	this.action;
	this.methodname;
	this.arrparameter = [];

};

function prettyCurrentTime() {
    var date = new Date();
    return date.toLocaleString();
}

function serverCallBack( socket )
{
	var serverErrBlock = new centralizeErrorHandling.Block( function() { console.log( "Error in Socket " ); socket.destroy(); } );
	
	socket.on("connect", serverErrBlock.guard( function() {
		socket.write( "Hello User : \n\r You Logged in at " + prettyCurrentTime() + "\n\r");
		socket.write( "Enter the Username you would like to use : " );
	winston.warn( "Hello User : \n\r You Logged in at " + prettyCurrentTime() + "\n\r" );
		var listener = new listenerObject();
		listener.action = "userInfo";
		listener.methodname = "onConnect";
		listener.arrparameter[0] = socket;

		var varUserDetail = serverActionListener.listenerAction( listener );	
		allUsers.push( varUserDetail );
		listUserDetails();
	}  ) );

	socket.on( "data" , serverErrBlock.guard( function( data ) {

		 var listener = new listenerObject();

 		listener.arrparameter[0] = data;
                listener.arrparameter[1] = socket;
                listener.arrparameter[2] = allUsers;

		if( getState( socket ) == "command" )
		{
			console.log ( "commandcenter server entered ");
                	listener.action = "ircCommandCenter";
                	listener.methodname = "onData";
		}
		else
		{
		        listener.action = "userInfo";
                	listener.methodname = "onData";
		}
		var varUserDetail = serverActionListener.listenerAction( listener );
		
		writeToSocket ( varUserDetail , allUsers );
		
		listUserDetails();
	} ) );

	socket.on ( "end" , serverErrBlock.guard( function () {
		
		var listener = new listenerObject();

                listener.arrparameter[0] = socket;
                listener.arrparameter[1] = allUsers;

                listener.action = "userInfo";
                listener.methodname = "onClose";
 		
		var varUserName = serverActionListener.listenerAction( listener );

		writeTextToSocket ( "\n" + varUserName + " has left the chat room.\n", allUsers); 

		listUserDetails();
	} ) );
	
	socket.on('timeout', function() {
	console.log( "Socket:Timeout Error " + err );
	            socket.destroy();
        });

        // handle uncaught exceptions
        socket.on('uncaughtException', function(err) {
		console.log( "Socket:uncaughtException Error " + err );
		            socket.destroy();
        });
	
	try
	{
		socket.on( "error", function() { console.log( "A socket error event thrown." ) } );
	}
	catch(err)
	{
		console.log( "Socket Error " + err );
	}
}

function getState( socket )
{
	console.log( "getState entered " );
	for( var i = 0; i < allUsers.length; i++ )
	{
		var userDets = allUsers[i];
		if( userDets.userSocket == socket )
		{
			console.log(" selected username : " + userDets.username  + " -- " + userDets.status + "" ) ;
			return userDets.status;
			break;
		}
	}
}

function writeToSocket( varUserDetail, allUsers)
{
    var curTime = prettyCurrentTime();
    var curText = " " + curTime + " : " + wordFilter( varUserDetail.dataText );
	if(varUserDetail.dataText == "\n")
	{
		return;
	}
	if( varUserDetail.messageFor == "self")
	{
		varUserDetail.userSocket.write ( curText );
	}
	else if ( varUserDetail.messageFor == "help" )
	{
		varUserDetail.userSocket.write ( String( config.helpString ) );
	}
	else if ( varUserDetail.messageFor == "all")
        {
		for( var i = 0; i < allUsers.length; i++ )
		{
			var userDets = allUsers[i];
			
			var varUserName =  varUserDetail.username + "";
	                userDets.userSocket.write ( varUserName + curText );
            redisClient.set( varUserName+curTime, varUserDetail.dataText );

		}
        }

}

function writeTextToSocket( textMssg , allUsers )
{
	for( var i = 0; i < allUsers.length; i++ )
        {
		var userDets = allUsers[i];

		userDets.userSocket.write ( textMssg );
		if( userDets.status == "command" )
		{
			userDets.userSocket.write ( ">" );
		}
	}
}

function listUserDetails()
{
	for( var i =0; i< allUsers.length; i++)
	{
		console.log("\n" +  allUsers[i].username + " - " + allUsers[i].status);
	}
}

function startServer()
{
		console.log ( "Starting Chitika IRC Server ... " );
		var netServer = net.createServer( serverCallBack );
        netServer.maxConnections = config.maxServerConnections; // This is set as a security step.
        var serverPort = config.serverPort;
		netServer.on('error', function (error) {
			console.log('netServer:Error: ' + error);
		});
		
		try{
			netServer.listen( serverPort );
		}
		catch(err)
		{
			console.log( "Server listen error encountered " + err );
		}
		

		console.log ( "Listening to Port  " + serverPort );	
}


exports.start = startServer;
// No need to export the below functions but for unit testing exposing them
exports.wordFilter = wordFilter;
exports.listUserDetails = listUserDetails;
exports.writeTextToSocket = writeTextToSocket;
exports.writeToSocket = writeToSocket;
exports.getState = getState;
exports.serverCallBack = serverCallBack;
exports.prettyCurrentTime = prettyCurrentTime;
exports.listenerObject = listenerObject;
