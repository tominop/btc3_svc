 /*!
 * @title btc3_svc BTC API microservice for tesnet3
 * @author Oleg Tomin - <ot@limex.io>
 * @dev Basic implementaion of BTC3 API functions  
 * MIT Licensed Copyright(c) 2018-2019
 */

const express = require("express")
const app = express()

const axios = require('axios')    //  AXIOS - compact lib for HttpRequest

const btcUrl = 'https://api.blockcypher.com/v1/btc/test3'    //  Blochcypher API provider for Bitcoin testnet3

    //  Route - check connect to API provider
app.get("/btc3/api/:token", (req, res) => {
    const token = req.params.token
    axios.get(btcUrl + '/balance/' + 'token=' + token) 
        .then(response => {
            res.header("Access-Control-Allow-Origin", "*")
            res.json({error: false, host: btcUrl, limit: response.data.limit})
            console.log('p: '+ btcUrl +'  limit:' + response.data.limit)
        })
        .catch(error => {
            res.header("Access-Control-Allow-Origin", "*")
            res.json({error: true})
            console.log('Error! p: '+ btcUrl + ' not connected!!!')
        })
})
        
    //  Route - balance of address
app.post("/btc3/balance/:addrs", (req, res) => {
    //  Standart format API 
    const addrsBTC = req.params.addrs
    axios.get(btcUrl + '/addrs/' + addrsBTC + '/balance')
        .then(response => {
            res.header("Access-Control-Allow-Origin", "*")
            res.json({ balance: response.data.final_balance / 10 ** 8 })
        })
        .catch(error => {
            console.log(error)
            var err = new Error('BTC API service not aviable')
            err.status = 501
            res.send(err)
        })
})

    //  Route - make, sign, send transfer Tx 
app.post("/btc3/newtx/:tx", (req, res) => {
    //  Standart format API for new tx
    const btcTx = req.params.tx
  //    console.log('create tx');
  const TOKEN = 'c97f6432c2ba4d3b8d3ced1407e9ec0a';
  var addrsFrom = [req.query.a]; //['mrG1ZLaUNWGrD7Kpy2ZBHbA1JJcQ1RTkTk'];
  var addrsTo = [req.query.b]; //['mwa4tW15bJereTKDDWVW5wJeKT2fKNa2tH'];
  var value = Number.parseInt(req.query.c); //300000;
  var my_wif_private_key = req.query.d;
  //    var keys = bitcoin.ECPair.fromWIF(my_wif_private_key, testnet);
  var keys = bitcoin.ECPair.fromWIF(my_wif_private_key);
  console.log('keys: ' + keys)
  var newtx = {
      inputs: [{ addresses: addrsFrom }],
      outputs: [{ addresses: addrsTo, value: value }]
  };
  needle.post(
      //        'https://api.blockcypher.com/v1/btc/test3/txs/new', JSON.stringify(newtx),
      'https://api.blockcypher.com/v1/btc/main/txs/new?token=$TOKEN', JSON.stringify(newtx),
      function(error, response, tmptx) {
          if (!error) {
              tmptx.pubkeys = [];
              console.log(tmptx)
              tmptx.signatures = tmptx.tosign.map(function(tosign, n) {
                  tmptx.pubkeys.push(keys.getPublicKeyBuffer().toString("hex"));
                  return keys.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");
              });
              // sending back the transaction with all the signatures to broadcast
              //                needle.post('https://api.blockcypher.com/v1/btc/test3/txs/send', JSON.stringify(tmptx),
              needle.post('https://api.blockcypher.com/v1/btc/main/txs/send?token=$TOKEN', JSON.stringify(tmptx),
                  function(error, response, finaltx) {
                      if (!error) {
                          res.send(finaltx.tx.hash);
                      } else {
                          console.log(error);
                      }
                  })
          } else {
              console.log(error);
          }
      });    axios.get(btcUrl + '/addrs/' + addrsBTC + '/balance')
        .then(response => {
            res.header("Access-Control-Allow-Origin", "*")
            res.json({ balance: response.data.final_balance / 10 ** 8 })
        })
        .catch(error => {
            console.log(error)
            var err = new Error('BTC API service not aviable')
            err.status = 501
            res.send(err)
        })
})

const port = process.env.PORT_BTC3 || 8103

app.listen(port, () => {
    console.log(`Microservice btc_svc listening on ${port}`)
})