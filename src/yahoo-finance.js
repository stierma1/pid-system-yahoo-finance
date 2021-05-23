const yahoo = require("yahoo-finance-history")
global.fetch = require("node-fetch");

module.exports = async function(){
  while(true){
    let [symbol, err, res] = await this.receive();
    try{
      let data = await yahoo.getPriceHistory(symbol);
      let dividendHistory = parseCSVData(data.dividendHistory);
      let priceHistory = parseCSVData(data.priceHistory);
      let splitHistory = parseCSVData(data.splitHistory);
      let d = {symbol, time:new Date(), dividendHistory,splitHistory,priceHistory};
      res?.(d);
    } catch(e){
      err?.(e)
    }
  }
}

function parseCSVData(d){
  var rows = d.split("\n").sort().reverse();
  var obj = {};
  var m = [];
  var splitF = rows[0].split(",");
  for (var i in splitF){
    obj[splitF[i]] = [];
    m[i] = splitF[i];
  }
  for(var i = 1; i < rows.length; i++){
    var s = rows[i].split(",");
    for(var j = 0; j < s.length; j++){
      obj[m[j]].push(s[j]);
    }
  }
  if(obj["Date"]){

    obj["EpochDate"] = [];
    for(var i of obj["Date"]){
      obj["EpochDate"].push(new Date(i).getTime() / 1000)
    }

  }
  return obj;
}