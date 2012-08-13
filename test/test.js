var Chat = require("../src/server/IrcServer" );
var assert = require( 'assert' );
exports.testwordFilter = function(test) {

	var expected = "Dumb-Dumber";
	var str = "Dumb-Dumber";
	var str1 = Chat.wordFilter( str );
	test.equal( str1, expected );
	
	var expected = "****";
	var str = "fuck";
	var str1 = Chat.wordFilter( str );
	test.equal( str1, expected );
	
	var expected = "********";
	var str = "fucksuck";
	var str1 = Chat.wordFilter( str );
	test.equal( str1, expected );

	var expected = "****.****";
	var str = "fuck.suck";
	var str1 = Chat.wordFilter( str );
	test.equal( str1, expected );
	
	var expected = "****-****";
	var str = "fuck-suck";
	var str1 = Chat.wordFilter( str );
	test.equal( str1, expected );
	
	var expected = "fu-ck";
	var str = "fu-ck";
	var str1 = Chat.wordFilter( str );
	test.equal( str1, expected );
    test.done();
}
