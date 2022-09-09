import express from "express";
import cors from 'cors'
import Jwt  from "jsonwebtoken";
const app = express();
app.use(express.json());
app.use(cors())



const users = [
  {
    id: "1",
    username: "bibek",
    password: "bibek01",
    isAdmin: true,
  },
  {
    id: "2",
    username: "asim",
    password: "asim02",
    isAdmin: false,
  },
];



app.get("/",(req,res)=>{

  res.json("newAccessToken hello")
})

let refreshTokens = [];


// refreshTokens vs refreshToken 

//this is server that automatic reffress the and give new acesstoken
app.post("/refreshz", (req, res) => {
  //take the refresh token from the user
  const refreshToken = req.body.token; //wehahe to pass token from user  to reffress 

  //send error if there is no token or it's invalid
  if (!refreshToken) return res.status(401).json("You are not authenticated!");


  //
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh token is not valid!");
  }
  Jwt.verify(refreshToken, "myRefreshSecretKey", (err, user) => {
    err && console.log(err);

    
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken, // this is toke tha is acessss
      refreshToken: newRefreshToken, //this is toke to make referess
    });
  });

  //if everything is ok, create new access token, refresh token and send to user
});




//Zenerate acess token

const generateAccessToken = (user) => {
    return Jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "mySecretKey", {
      expiresIn: "15m",
    })
  };


//Zenerate refres toke
  const generateRefreshToken = (user) => {
    return Jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "myRefreshSecretKey");
  };



// loggin paths

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => {
      return u.username === username && u.password === password;
    });
    if (user) {   //users vs user
      //Generate an access token
                                     // jwt bycript incode status 
    //   const   accessToken= Jwt.sign({id:user.id,isAdmin:user.isAdmin}, "mySecretKey");
   //Generate an access token
   const accessToken = generateAccessToken(user);
   const refreshToken = generateRefreshToken(user);
   refreshTokens.push(refreshToken);
     
      res.json({
        username: user.username,
        isAdmin: user.isAdmin,
        accessToken,
        refreshToken,
       
      });
    } else {
      res.status(400).json("Username or password incorrect!");
    }
  });
  

  //veryfings  
const verify = (req, res, next) => {
    const authHeader = req.headers.authorization;  //is thi like giving the jsonn Bearer +Token

    if (authHeader) {
      const token = authHeader.split(" ")[1];
  
      Jwt.verify(token, "mySecretKey", (err, user) => {
        if (err) {
          return res.status(403).json("Token is not valid!");
        }
  
        req.user = user; //when toke is valid its show the decode/encript  status of token
        
        next();
      });
    } else {
      res.status(401).json("You are not authenticated!");
    }
  };
  


// 2

// 1 
  app.delete("/users/:userId", verify, (req, res) => {
    if (req.user.id === req.params.userId || req.user.isAdmin) {
      res.status(200).json("User has been deleted.");
    } else {
      res.status(403).json("You are not allowed to delete this user!");
    }
  });
  

  
  //logout

  
app.post("/logout", verify, (req, res) => {
    const refreshToken = req.body.token;
    // const refreshToken = req.headers.authorization,
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    res.status(200).json("You logged out successfully.");
  });


  //server lissten
  app.listen(8000,()=>{

    console.log("this server running through 4000 port ")
  })