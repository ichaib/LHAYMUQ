var nlp = require('natural');

function parse(query)
{ 
	natural.PorterStemmer.attach();
	tokens = query.tokenizeAndStem();
    //summary = "sum1";
    //array = ["item1", "item2"];
    json = JSON.stringify({ summary: summary, transactions: array});
    return json;
}

function classify(){
	classifier = new natural.BayesClassifier();
    classifier.addDocument([], 'spend');
    classifier.addDocument([], 'earn');
}

function get_data(action, timespan){
	all_transactions = get_transactions();
	//transactions = 
	return transactions;
}

function get_transactions(){
	//Get transactions from Open Bank Project API
}

module.exports.parse = parse;