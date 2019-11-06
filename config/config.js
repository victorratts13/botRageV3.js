var generalConfiguration = {
    apiKey: 'Your_api_Bitmex',
    apiSecret: 'Your_Secret_Bitmex',
    UDFPort: 5001,
    requestTimeout: 60000,
    requestTimeBot: 5000,
    remoteRequest: 'https://testnet.bitmex.com',
    localRequest: 'http://localhost' ,
    orderType: 'Market' ,
    volOrder: 31,
    volStop: 31,
    MaShort: 1,
    MaLong: 9,
    RSI: 14,
    RSISetuplow: 45,
    RSISetupHigh: 75,
    renko: 5,
    pair: 'XBTUSD',
    maxResolution: 1,
    countRequest: 0,
    returnBuyVal: 1,
    returnSellVal: 2

}

module.exports = generalConfiguration;
