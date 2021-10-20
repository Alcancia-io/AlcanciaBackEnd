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
    console.log(access_token);
  } catch (e) {
    console.error(e);
  }
}

var requestOrder = async function (body,token){
    
}

var token=await getPaypalToken();
//console.log(token);


async function createOrder(){
  const body = {
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: '100'
      }
    }],
    application_context: {
      brand_name: 'Alcancia',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
      return_url: 'http://localhost:8000/execute-order',
      cancel_url: 'http://localhost:8000/cancel-order'
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
      //json: true
    })
    .then(function (response){
      //console.log(response.data.links);
      for(let i=0;i<response.data.links.length;i++){
        if(response.data.links[i].rel=='approve'){
          //console.log(response.data.links[i].href);
          result= response.data.links[i].href;
          //return 'sadfgds';
        }
      }
      
    });
  }catch(e){
    console.error(e);
  }
  //requestOrder(body,token);  
  return result;
}

//var order= await createOrder();
export default createOrder;

