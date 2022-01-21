const {getPaypalToken,executeOrder,getOrderInfoPaypal} = require('./paypalController.js');

async function captureOrder(orderToken){
    try{
        let token = await getPaypalToken();
        let result = await executeOrder(token,orderToken);
        return result;
    }catch(e){
        console.log(e);
    }
}

async function getOrderInfo(req,order,res){
    try{
        let token = await getPaypalToken();
        let orderInfo=getOrderInfoPaypal(token,order);
        return orderInfo;
    }catch(e){
        return res.status(500).error("Error retriving order info");
    }
}


exports.captureOrder = captureOrder;
exports.getOrderInfo = getOrderInfo;