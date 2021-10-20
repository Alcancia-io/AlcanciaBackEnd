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

var token=await getPaypalToken();
console.log(token);



