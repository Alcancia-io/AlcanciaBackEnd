const paypal = require('@paypal/checkout-server-sdk');
const { response } = require('express');
const payPalClient = require('../clients/paypalClient.js');

module.exports = class PaypalController{

  static async createOrder(req,res) {
    let request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": "USD",
                    "value": req.body.amount
                }
            }
        ]
    });
    try{
      let response = await  payPalClient.client().execute(request);
      console.log(`Response: ${JSON.stringify(response)}`);
    
      // If call returns body in response, you can get the deserialized version from the result attribute of the response.
      console.log(`Order: ${JSON.stringify(response.result)}`);
      res.status(201).send(JSON.stringify(response.result));
    }catch(e){
      console.log(e);
      res.status(response.status);
    }
    
  }

  static async captureOrder(req,res){
    let response;
    try {
      const request = new paypal.orders.OrdersCaptureRequest(req.body.orderToken);
      request.requestBody({});
      response = await payPalClient.client().execute(request);
      if (true){
          console.log("Status Code: " + response.statusCode);
          console.log("Status: " + response.result.status);
          console.log("Order ID: " + response.result.id);
          console.log("Links: ");
          response.result.links.forEach((item, index) => {
              let rel = item.rel;
              let href = item.href;
              let method = item.method;
              let message = `\t${rel}: ${href}\tCall Type: ${method}`;
              console.log(message);
          });
          console.log("Capture Ids:");
          response.result.purchase_units.forEach((item,index)=>{
            item.payments.captures.forEach((item, index)=>{
              console.log("\t"+item.id);
              });
          });
          // To toggle print the whole body comment/uncomment the below line
          console.log(JSON.stringify(response.result, null, 4));
      }
      return response.result;
    }catch(e){
      let message = JSON.parse(e.message);
      console.log(e.statusCode);
      return res.status(e.statusCode).send({error:message.name,
                                        detail:message.detail[0].issue});
    }
  }


}



/*
const axios =  require('axios');

async function getPaypalToken(){
  try {
    const { data: { access_token } } = await axios({
      url: process.env.Paypal+'/v1/oauth2/token',
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'en_US',
        'content-type': 'application/x-www-form-urlencoded',
      },auth: {
        username: process.env.Client,
        password: process.env.Secret,
      },params: {
        grant_type: 'client_credentials',
      },
    });
    return access_token;
  } catch (e) {
    console.error(e);
  }
}

async function executeOrder(token,tokenOrder){
  let result;
  try{
    await axios({
      url: process.env.Paypal+'/v2/checkout/orders/'+tokenOrder+'/capture',
      port: 443,
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
        'Prefer': 'return=representation'
      }
    })
    .then(function (response){
      for(let i=0;i<response.data.purchase_units.length;i++){
        for(let j=0;j<response.data.purchase_units[i].payments.captures.length;j++){
          console.log(response.data.purchase_units[i].payments.captures[j].status);
        }
        
      }
      if(response.data.status=='COMPLETED'){
        result=response.data.id;
      }else if(response.data.status=='PAYER_ACTION_REQUIRED'){
        result=null;
      }
    });
  }catch(e){
    console.error(e);
  }
  return result;
}

async function getOrderInfoPaypal(token,order){
  let result;
  try{
    await axios({
      url: process.env.Paypal+'/v2/checkout/orders/'+order,
      port: 443,
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      }
    })
    .then(function (response){
      result = response.data;
      console.log(response.data);
    });
  }catch(e){
    console.error(e);
  }
  return result;
}*/
//exports.createOrder = createOrder;
//exports.getPaypalToken = getPaypalToken;
//exports.executeOrder = executeOrder;
//exports.getOrderInfoPaypal = getOrderInfoPaypal;
