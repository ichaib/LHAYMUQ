function parse(query)
{ 
    summary = "sum1";
    array = ["item1", "item2"];
    json = JSON.stringify({ summary: summary, transactions: array});
    return json;
}

module.exports.parse = parse;