var _ = require('underscore');
var natural = require('natural');
var nlp = require('nlp-node-master');
var date_extractor = require('./date_extractor.js');
var util = require('util');
var obp = require('./obpdata.js');


function parse(query)
{
	//Initiate classifier
	classifier = new natural.BayesClassifier();
	init();
	var json;
	if (query){
		//Figure out what action should be taken and for which timespan by analysing the query string
		action = get_action(query);
		timespan = get_timespan(query);
		//Return appropriate dataset in the right json format
		json = get_data(action, timespan);
	}
    return json;
}

function get_action(query){
	natural.PorterStemmer.attach();
	tokens = query.tokenizeAndStem();
	action = classifier.classify(tokens);
	console.log("=----------- action is: " + action);
	return action;
}

function get_timespan(query){
	//Example of output format = { text: '9th of april, 2005', from: { year: '2005', month: '04', day: '09' }, to: {} }
	timespan = date_extractor(query);
	from = new Date(timespan.from.year, timespan.from.month, timespan.from.day);
	to = new Date(timespan.to.year, timespan.to.month, timespan.to.day);
	console.log("=----------- from: " + from);
	console.log("=----------- to: " + to);
	return {"from":from, "to":to};
}

function get_data(action, timespan){
	switch (action){
		case "earn": // obp.earn.timespan(start, end)
			break;
		case "spend":

			result = obp.get_spending(timespan.from, timespan.to);
			console.log("=----------- data successfully published. Sum is: " + result.sum);
			
			break;
		case "payment-to": //
			break;
		case "payment-from": //
			break; 
		default:
		//
	}
	return {"summary" : result.sum, "transactions" : result.transactions};
}


//TODO: add training set
function init(){
	classifier.addDocument(['how', 'much', 'money','I', 'have', 'spent'], 'spend');
    classifier.addDocument(['how', 'much', 'money','I', 'have', 'earned'], 'earn');
    classifier.addDocument(['my', 'payment', 'from'], 'payment-from');
    classifier.addDocument(['my', 'payment', 'to'], 'payment-to');
    classifier.addDocument('payment to qqqq', 'payment-to');
    classifier.train();
}

module.exports.parse = parse;