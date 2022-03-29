const { mockRequest, mockResponse } = require('../utils/interceptor')
const userController = require('../controllers/userController')
const { firestore } = require('firebase-admin');
const { admin } = require('../middlewares/firebase.js');

test('Same day balance', async () => {
  let req = mockRequest();
  req.params.uid = 'MMHoNsa1JxhB4hWN2sHGRb4ir4m2';  
  const res = mockResponse();
  let todayDate = new Date();
  let today = Date.UTC(todayDate.getFullYear(),
                      todayDate.getMonth()+1,
                      todayDate.getDate());
  await userController.getUserBalance(req, res);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalledTimes(1);
  expect(res.send).toHaveBeenCalledWith({balance:251.188,
                                        lastUpdate:today});
});

//test('Two days After first deposit')
test('Two days After first deposit', async () => {
  let req = mockRequest();
  req.params.uid = 'tCtMoH7Y0GYql3uFuJeNJcwutWG2';  
  const res = mockResponse();
  
  let todayDate = new Date();
  let today = Date.UTC(todayDate.getFullYear(),
                      todayDate.getMonth()+1,
                      todayDate.getDate());
  let twoDaysBeforeUTC = Date.UTC(todayDate.getFullYear(),
                      todayDate.getMonth(),
                      todayDate.getDate()-2);
  let d = new Date(twoDaysBeforeUTC);
  admin.firestore().
        collection('users').
        doc(req.params.uid).
        update({
                "lastDateUpdatedBalance": firestore.Timestamp.fromDate(d),
                "balance":200.589});
  await userController.getUserBalance(req, res);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalledTimes(1);
  expect(res.send).toHaveBeenCalledWith({balance:200.836,
                                        lastUpdate:today});
});
//test('Zero balance')
test('Zero balance', async () => {
  let req = mockRequest();
  req.params.uid = 'wzjhbbxemra4goFJQfih2uoNKnw2';  
  const res = mockResponse();
  let todayDate = new Date();
  let today = Date.UTC(todayDate.getFullYear(),
                      todayDate.getMonth()+1,
                      todayDate.getDate());
  await userController.getUserBalance(req, res);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalledTimes(1);
  expect(res.send).toHaveBeenCalledWith({balance:0.00,
                                        lastUpdate:today});
  //expect().toBe(res);
});
//test('')

test('Not a valid user', async () => {
  let req = mockRequest();
  req.params.uid = '12345';  
  const res = mockResponse();
  await userController.getUserBalance(req, res);
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.send).toHaveBeenCalledTimes(1);
  expect(res.send).toHaveBeenCalledWith({message:"No such document"});
});