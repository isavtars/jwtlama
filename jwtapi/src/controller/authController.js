import jwt from "jsonwebtoken"
import users from "../model/data.js"

//this class wher diiffren controll operation stote
//like delete user
//post login user
//class hold diff obj
 export default class AuthController {
    

//login
async adduser(req,res){
  
    // const {username,password}=req.body;
     
    // //use data base heare come from usernmodel
    // const use= users.find((u)=>{
    //    return u.username === username && u.password === password;
    // })

    // if(use){
    //     // res.status(200).json({use,sucess:true,message:"sucess"}); old
    //     //jwt funda 
    //     // generte the token (1  step)
    //     const acessToken=jwt.sign({id:use.id, isAdmin:use.isAdmin},"mySecretkey")

    //     res.json({
    //         username:use.username,
    //         isAdmin:use.isAdmin,
    //         acessToken,
    //     })
    // }else{
    //     res.status(400).json({sucess:false,message:"login fdaillle"});
    // }
   
  
}



 }