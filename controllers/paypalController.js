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
}

exports.getPaypalToken = getPaypalToken;
exports.executeOrder = executeOrder;
exports.getOrderInfoPaypal = getOrderInfoPaypal;
