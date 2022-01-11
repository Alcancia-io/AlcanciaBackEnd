import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

var getPaypalToken = async function (){
  try {
    const { data: { access_token } } = await axios({
      url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'en_US',
        'content-type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: process.env.Client,
        password: process.env.Secret,
      },
      params: {
        grant_type: 'client_credentials',
      },
    });
    return access_token;
  } catch (e) {
    console.error(e);
  }
}

var token=await getPaypalToken();

export async function createOrder(usdAmount,currency_code,uid){
  const body = {
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: usdAmount
      }
    }],
    application_context: {
      brand_name: 'Alcancia',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
      return_url: 'http://localhost:4100/paypalOrder/successfull',
      cancel_url: 'http://localhost:4100/main-screen'
    }
  };

  let result;
  try{
    await axios({
      url: process.env.Paypal+'/v2/checkout/orders',
      port: 443,
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      data: body
    })
    .then(function (response){
      for(let i=0;i<response.data.links.length;i++){
        if(response.data.links[i].rel=='approve'){
          result= response.data.links[i].href;
        }
      }
      
    });
  }catch(e){
    console.error(e);
  }
  return result;
}

export async function executeOrder(tokenOrder){
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
      if(response.data.status=='COMPLETED'){
        result=response.data.id;
        console.log("EXECUTE ORDER");
        console.log(response.data.id);
      }else if(response.data.status=='PAYER_ACTION_REQUIRED'){
        result=null;
      }
    });
  }catch(e){
    console.error(e);
  }
  return result;
}


export async function getOrderInfo(order){
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
      console.log("EXECUTE ORDER");
      console.log(response.data);
    });
  }catch(e){
    console.error(e);
  }
  return result;
}

export default createOrder;


