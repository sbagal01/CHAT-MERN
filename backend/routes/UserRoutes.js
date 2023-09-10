const express=require('express');
const router=express.Router()
const {registerUser,allUsers}=require('../controllers/UserControllers');
const {authUser}=require('../controllers/authUser');
const {protect}=require('../middleware/authMiddleware.js');

router.route('/').post(registerUser);
router.route('/').get(protect,allUsers)
router.post('/login',authUser);


module.exports=router;