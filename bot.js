const config = require('./config/config');
const localSize = config.maxResolution;
const consoleFile = require('./var/console/console');
const fs = require('fs');
const crypto = require('crypto');
const request = require('request');
const SMA = require('technicalindicators').SMA;
const RSI = require('technicalindicators').RSI;
const setTime = config.requestTimeBot;
const symbolDefault = config.pair;
const clearModule = require('clear-module');
let count = config.countRequest;

setInterval(() => {
        //console.log('\033c'+ count++);

    clearModule('./var/temp/tempFileBuy');
    clearModule('./var/temp/tempFileSell');
    clearModule('./var/temp/lastOrder.js');
    clearModule('./var/temp/stop.js');

    let stopFile = require('./var/temp/stop');
    let lastOrderSend = require('./var/temp/lastOrder');
    let BuyFile = require('./var/temp/tempFileBuy');
    let SellFile = require('./var/temp/tempFileSell');
    let frontPort = config.UDFPort;
    let frontRequest = config.localRequest+':'+frontPort;
    let uriPost = config.remoteRequest;

    request({
        url: config.remoteRequest+'/api/v1/orderBook/L2?symbol='+symbolDefault+'&depth=1',
        json: true
    }, (err, response, body) => {
        book = body;
        
        let bookBuy = book[1].price;
        let bookSell = book[0].price;
        let buy_percect, sell_percect;

        buy_percect = bookBuy * 3 / 100;
        sell_percect = bookSell * 3 / 100;
        buy_percect = parseInt(buy_percect);
        sell_percect = parseInt(sell_percect);
        
        const apiKey = config.apiKey;
        const apiSecret = config.apiSecret;

        let link = frontRequest+'/history';
        let unix = new Date().getTime() / 1000;
        let timeUnix = parseInt(unix);
        let outUnix = timeUnix - 86400;
        let query = `?symbol=${symbolDefault}&from=${outUnix}&to=${timeUnix}&resolution=${localSize}`;
        let lead_data = Date();

        request({
            url: link+query,
            json: true
        }, (err, response, body) => {
            var principalBody = body;
            if(err){
                console.log('\033c algum problema de requisição, verifique o erro -> '+ err);
            }else{
                console.log('\033c Bem-Vindo ao BotRage v3.0.1 \n \x1b[33m dados obtidos com sucesso, \n trabalhando com informações... \n');
                var actualValue = body.c.slice(-1)[0];

                var
                POST = 'POST',
                Del = 'DELETE',
                path = '/api/v1/order',
                pathDell = '/api/v1/order/all',
                pathClose = '/api/v1/order/closePosition',
                expire = new Date().getTime() / 1000, // 1 min in the future
                expires = parseInt(expire) + 86460 ;

                if(config.orderType == 'Limit'){
                    //objeto de compra
                var buy = {
                    symbol: symbolDefault,//par
                    orderQty: config.volOrder,//quantidade de contratos
                    price: bookBuy,//preço limit
                    ordType: config.orderType,//tipo
                    //stopPx: actualValue - 70, // (5*actualValue/100), //% do Stop
                    side: "Buy",
                    text: "Send From BotRage 3.0.1 -> Buy"
                    };
                    //Objeto de venda 
                var sell = {
                    symbol: symbolDefault,//par
                    orderQty: config.volOrder,//quantidade de contratos
                    price: bookSell,//preço limit
                    ordType: config.orderType,//tipo
                    //stopPx: actualValue + 70, // (5*actualValue/100),//% do stop
                    side: "Sell",
                    text: "Send From BotRage 3.0.1 -> Sell"
                    };
                    //Objeto de fechamento
                var close = {
                        symbol: symbolDefault
                    },
                    //Delets
                    DellBuy = {
                        symbol: symbolDefault,
                        filter: {
                            side: 'Buy'
                        },
                        text: 'Send From BotRage V3.0.1: Delet for Buy'
                    },
                    DellSell = {
                        symbol: symbolDefault,
                        filter: {
                            side: 'Sell'
                        },
                        text: 'Send From BotRage V3.0.1: Delet for Sell'
                    },

                    DellLimit = {
                        symbol: symbolDefault,
                        filter: {
                            ordType: 'Limit'
                        },
                        text: 'Send From BotRage V3.0.1: Delet for Limit Orders'
                    },
                    //Objeto de stop - Compra
                    stopBuy = {
                        symbol: symbolDefault,//par
                        orderQty: config.volStop,//quantidade de contratos
                        price: bookBuy,//preço limit
                        ordType:"StopLimit",//tipo
                        stopPx: bookBuy - buy_percect, //% do Stop
                        side: "Sell",
                        text: "Send From BotRage 3.0.1 -> StopBuy"
                        },
                    //Objeto de stop - Venda    
                    stopSell = {
                        symbol: symbolDefault,//par
                        orderQty: config.volStop,//quantidade de contratos
                        price: bookSell,//preço limit
                        ordType:"StopLimit",//tipo
                        stopPx: bookSell + sell_percect, //% do Stop
                        side: "Buy",
                        text: "Send From BotRage 3.0.1 -> StopSell"
                    }    
                    
                }
            
                if(config.orderType == 'Market'){
                //objeto de compra
                var buy = {
                    symbol: symbolDefault,//par
                    orderQty: config.volOrder,//quantidade de contratos
                    //price: actualValue,//preço limit
                    ordType: config.orderType,//tipo
                    //stopPx: actualValue - 70, // (5*actualValue/100), //% do Stop
                    side: "Buy",
                    text: "Send From BotRage 3.0.1 -> Buy"
                    };
                    //Objeto de venda 
                var sell = {
                    symbol: symbolDefault,//par
                    orderQty: config.volOrder,//quantidade de contratos
                    //price: actualValue,//preço limit
                    ordType: config.orderType,//tipo
                    //stopPx: actualValue + 70, // (5*actualValue/100),//% do stop
                    side: "Sell",
                    text: "Send From BotRage 3.0.1 -> Sell"
                    };
                    //Objeto de fechamento
                var close = {
                        symbol: symbolDefault
                    },
                    //Delets
                    DellBuy = {
                        symbol: symbolDefault,
                        filter: {
                            side: 'Buy'
                        },
                        text: 'Send From BotRage V2.5'
                    },
                    DellSell = {
                        symbol: symbolDefault,
                        filter: {
                            side: 'Sell'
                        },
                        text: 'Send From BotRage V2.5'
                    },
                    //Objeto de stop - Compra
                    stopBuy = {
                        symbol: symbolDefault,//par
                        orderQty: config.volStop,//quantidade de contratos
                        //price: actualValue - 1,//preço limit
                        ordType:"Stop",//tipo
                        stopPx: actualValue - 170, //% do Stop
                        side: "Sell",
                        text: "Send From BotRage 3.0.1 -> StopBuy"
                        },
                    //Objeto de stop - Venda    
                    stopSell = {
                        symbol: symbolDefault,//par
                        orderQty: config.volStop,//quantidade de contratos
                        //price: actualValue + 1,//preço limit
                        ordType:"Stop",//tipo
                        stopPx: actualValue + 170, //% do Stop
                        side: "Buy",
                        text: "Send From BotRage 3.0.1 -> StopSell"
                    }
                }

                var postBody = JSON.stringify(buy);
                var signatureBuy = crypto.createHmac('sha256', apiSecret).update(POST + path + expires + postBody).digest('hex');
                console.log('Assinatura Buy -> '+signatureBuy);
                var headers = {
                    'content-type' : 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'api-expires': expires,
                    'api-key': apiKey,
                    'api-signature': signatureBuy
                };
                    const requestOptionsBuy = {
                    headers: headers,
                    url: uriPost + path,
                    method: POST,
                    body: postBody 
                }

                var postBody = JSON.stringify(sell);
                var signatureSell = crypto.createHmac('sha256', apiSecret).update(POST + path + expires + postBody).digest('hex');
                console.log('Assinatura Sell -> '+signatureSell);
                var headers = {
                    'content-type' : 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'api-expires': expires,
                    'api-key': apiKey,
                    'api-signature': signatureSell
                };
                const requestOptionsSell = {
                    headers: headers,
                    url: uriPost + path,
                    method: POST,
                    body: postBody 
                }

                var postBody = JSON.stringify(close);
                var signatureClose = crypto.createHmac('sha256', apiSecret).update(POST + pathClose + expires + postBody).digest('hex');
                console.log('Assinatura Close -> '+signatureClose);
                var headers = {
                    'content-type' : 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'api-expires': expires,
                    'api-key': apiKey,
                    'api-signature': signatureClose
                };
                const requestOptionsClose = {
                    headers: headers,
                    url: uriPost + pathClose,
                    method: POST,
                    body: postBody 
                }

                var postBody = JSON.stringify(stopBuy);
                var signatureStopBuy = crypto.createHmac('sha256', apiSecret).update(POST + path + expires + postBody).digest('hex');
                console.log('Assinatura Stop/buy -> '+signatureStopBuy);
                var headers = {
                    'content-type' : 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'api-expires': expires,
                    'api-key': apiKey,
                    'api-signature': signatureStopBuy
                };
                const requestOptionsStopBuy = {
                    headers: headers,
                    url: uriPost + path,
                    method: POST,
                    body: postBody 
                }
                
                var postBody = JSON.stringify(stopSell);
                var signatureStopSell = crypto.createHmac('sha256', apiSecret).update(POST + path + expires + postBody).digest('hex');
                console.log('Assinatura Stop/Sell -> '+signatureStopSell);
                var headers = {
                    'content-type' : 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'api-expires': expires,
                    'api-key': apiKey,
                    'api-signature': signatureStopSell
                };
                const requestOptionsStopSell = {
                    headers: headers,
                    url: uriPost + path,
                    method: POST,
                    body: postBody 
                }

                var postBody = JSON.stringify(DellBuy);
                var signatureDellBuy = crypto.createHmac('sha256', apiSecret).update(Del + pathDell + expires + postBody).digest('hex');
                console.log('Assinatura Dellet - Buy -> '+signatureDellBuy);
                var headers = {
                    'content-type' : 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'api-expires': expires,
                    'api-key': apiKey,
                    'api-signature': signatureDellBuy
                };
                const requestOptionsDellBuy = {
                    headers: headers,
                    url: uriPost + pathDell,
                    method: Del,
                    body: postBody 
                }

                var postBody = JSON.stringify(DellSell);
                var signatureDellSell = crypto.createHmac('sha256', apiSecret).update(Del + pathDell + expires + postBody).digest('hex');
                console.log('Assinatura Dellet - Sell -> '+signatureDellSell);
                var headers = {
                    'content-type' : 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'api-expires': expires,
                    'api-key': apiKey,
                    'api-signature': signatureDellSell
                };
                const requestOptionsDellSell = {
                    headers: headers,
                    url: uriPost + pathDell,
                    method: Del,
                    body: postBody 
                }

                var postBody = JSON.stringify(DellLimit);
                var signatureDellLimit = crypto.createHmac('sha256', apiSecret).update(Del + pathDell + expires + postBody).digest('hex');
                console.log('Assinatura Dellet - Limit -> '+signatureDellLimit);
                var headers = {
                    'content-type' : 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'api-expires': expires,
                    'api-key': apiKey,
                    'api-signature': signatureDellLimit
                };
                const requestOptionsDellLimit = {
                    headers: headers,
                    url: uriPost + pathDell,
                    method: Del,
                    body: postBody 
                }

                let RsiLow = config.RSISetuplow;
                let RsiHigh = config.RSISetupHigh;

                MA1 = SMA.calculate({period: config.MaShort, values: principalBody.c});
                MA2 = SMA.calculate({period: config.MaLong, values: principalBody.c});
                console.log('\n');//quebra de linha
                console.log(`MA01 periodo ${config.MaShort} -> `+MA1.slice(-1)[0]);
                console.log(`MA02 periodo ${config.MaLong} -> `+MA2.slice(-1)[0]+'\n');

                let inputRSI = {
                    values: principalBody.o,
                    period: 14
                }

                let resultRSI = RSI.calculate(inputRSI);
                let RSIreverseArray = resultRSI.slice(0).reverse();
                
                Ma01_val = MA1.slice(-1)[0];
                Ma02_val = MA2.slice(-1)[0];
                RSI_val = RSIreverseArray[0];
                console.log(`RSI periodo ${config.RSI} -> `+RSI_val)

                function cross(){
                    if(Ma01_val > Ma02_val){
                        if(RSI_val > RsiLow){
                            return 1;//buy
                        }
                    }
                    if(Ma01_val < Ma02_val){
                        if(RSI_val < RsiHigh){
                            return 2;//sell
                        }
                    }
                    return 0;
                }

                function buyFunction(){
                    setTimeout(() => {
                        if(lastOrderSend.side == 'Sell'){
                            console.log(' \x1b[32m executando compra:');
                            request(requestOptionsBuy, (err, res, body) => {
                                if(err){
                                    console.log('erro na compra. Verifique BuyFunction: '+err);
                                }else{
                                    let tempFile = `var fileBuy = ${body}; module.exports = fileBuy;`;
                                    let lastOrder = `var lastOrderSend = ${body}; module.exports = lastOrderSend;`;
                                    fs.writeFile('./var/temp/lastOrder.js', lastOrder, (err) => {
                                        if(err){
                                            console.log('erro ao criar arequivo: lastOrder.js ->'+err)
                                        }else{
                                            console.log('create temporary lastOrder File on ./var/lastOrder.js \n');
                                        }
                                    });
                                    fs.writeFile('./var/temp/tempFileBuy.js', tempFile, () => {
                                        if(err){
                                            console.log('erro ao criar arequivo: tempFileBuy.js ->'+err)
                                        }else{
                                            console.log('create file temp Buy');
                                        }
                                    });
                                }
                            })
                        }
                    }, 3000)
                }

                function sellFunction(){
                    setTimeout(() => {
                        if(lastOrderSend.side == 'Buy'){
                            console.log(' \x1b[32m executando Venda:');
                            request(requestOptionsSell, (err, res, body) => {
                                if(err){
                                    console.log('erro na Venda. Verifique SellFunction: '+err);
                                }else{
                                    let tempFile = `var fileSell = ${body}; module.exports = fileSell;`;
                                    let lastOrder = `var lastOrderSend = ${body}; module.exports = lastOrderSend;`;
                                    fs.writeFile('./var/temp/lastOrder.js', lastOrder, (err) => {
                                        if(err){
                                            console.log('erro ao criar arequivo: lastOrder.js ->'+err)
                                        }else{
                                            console.log('create temporary lastOrder File on ./var/lastOrder.js \n');
                                        }
                                    });
                                    fs.writeFile('./var/temp/tempFileSell.js', tempFile, () => {
                                        if(err){
                                            console.log('erro ao criar arequivo: tempFileSell.js ->'+err)
                                        }else{
                                            console.log('create file temp Sell');
                                        }
                                    });
                                }
                            })
                        }
                    }, 3000)
                }

                function stopSellFunction(){
                    if(stopFile.lastStop == 'buy'){
                        console.log(' \x1b[32m executando Stop Sell:');
                        request(requestOptionsStopSell, function(error, response, body) {
                            if (error) { console.log(error); }
                            console.log('criando stop.js file...')
                            let stopFile = `let stop = {lastStop: 'sell', valueStop: ${config.volStop}}; module.exports = stop;`;
                            fs.writeFile('./var/temp/stop.js', stopFile, (err) => {
                                if(err){
                                    console.log('erro ao criar arquivo: stop.js ->'+err)
                                }else{
                                    console.log('create temporary stop File on ./var/stop.js \n');
                                }
                            })
                        });
                    }else{
                        console.log('Stop Sell Enviado...')
                    }
                }

                function stopBuyFunction(){
                    if(stopFile.lastStop == 'sell'){
                        console.log(' \x1b[32m executando Stop Buy:');
                        request(requestOptionsStopBuy, function(error, response, body) {
                            if (error) { console.log(error); }
                            console.log('criando stop.js file...');
                            let stopFile = `let stop = {lastStop: 'buy', valueStop: ${config.volStop}}; module.exports = stop;`;
                            fs.writeFile('./var/temp/stop.js', stopFile, (err) => {
                                if(err){
                                    console.log('erro ao criar arquivo: stop.js ->'+err)
                                }else{
                                    console.log('create temporary stop File on ./var/stop.js \n');
                                }
                            })
                        });
                    }else{
                        console.log('Stop buy Enviado...')
                    }
                }

                function DeletLimit(){
                    if(config.orderType == 'Limit'){
                        if(body.ordStatus == 'Filled'){
                            console.log(' \x1b[32m Executando Delete Limit');
                            request(requestOptionsDellLimit, function(error, response, body) {
                                if (error) { console.log(error); }
                            console.log(body);
                            });
                        }
                    }
                }

                let buyReturnVal = config.returnBuyVal;
                let sellReturnVal = config.returnSellVal;
                console.log('valor do cross -> '+cross())

                if(cross() == 1){
                    if(lastOrderSend.side == 'Sell'){
                        console.log(' \x1b[32m Fechando Posição Aberta \n');
                        request(requestOptionsClose, function(error, response, body) {
                            if (error) { console.log(error); }
                            console.log(body);
                        });
                    }
                    if(lastOrderSend.side == 'Buy'){
                        if(lastOrderSend.ordType == config.orderType){
                            console.log('Compra executada... Aguardando Venda');
                        }
                        if(lastOrderSend.ordType == 'StopLimit'){
                            console.log(' \x1b[32m Executando Close');
                            request(requestOptionsClose, function(error, response, body) {
                                if (error) { console.log('erro no close da compra -> '+error); }
                                console.log(body);
                            });
                            console.log(' \x1b[32m executando Deletando Stop: Sell');
                            request(requestOptionsDellBuy, function(error, response, body) {
                                if (error) { console.log('erro ao apagar Stop da compra -> '+error); }
                            console.log(body);
                            });
                            stopBuyFunction();
                            buyFunction();
                        }
                    }else{
                        console.log(' \x1b[32m executando Deletando Stop: Sell');
                        request(requestOptionsDellBuy, function(error, response, body) {
                        if (error) { console.log(error); }
                        console.log(body);
                        });
                        stopBuyFunction();
                        buyFunction();
                    }
                }else{
                    console.log('Aguardando proximo Cruzamento Para Compra...');
                }

                if(cross() == 2){
                    if(lastOrderSend.side == 'Buy'){
                        console.log(' \x1b[32m Fechando Posição Aberta \n');
                        request(requestOptionsClose, function(error, response, body) {
                            if (error) { console.log(error); }
                            console.log(body);
                        });
                    }
                    if(lastOrderSend.side == 'Sell'){
                        if(lastOrderSend.ordType == config.orderType){
                            console.log('Compra executada... Aguardando Venda');
                        }
                        if(lastOrderSend.ordType == 'StopLimit'){
                            console.log(' \x1b[32m Executando Close');
                            request(requestOptionsClose, function(error, response, body) {
                                if (error) { console.log('erro no close da compra -> '+error); }
                                console.log(body);
                            });
                            console.log(' \x1b[32m executando Deletando Stop: Sell');
                            request(requestOptionsDellSell, function(error, response, body) {
                                if (error) { console.log('erro ao apagar Stop da compra -> '+error); }
                            console.log(body);
                            });
                            stopSellFunction();
                            sellFunction();
                        }
                    }else{
                        console.log(' \x1b[32m executando Deletando Stop: Sell');
                        request(requestOptionsDellSell, function(error, response, body) {
                        if (error) { console.log(error); }
                        console.log(body);
                        });
                        stopSellFunction();
                        sellFunction();
                    } 
                }else{
                    console.log('Aguardando proximo Cruzamento Para Venda...')
                }
            }
        })
    });
}, setTime);
