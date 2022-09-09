
import axios from "axios";
import { useState } from "react";
import jwt_decode from "jwt-decode";
import "./App.css"

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);



  //refress toke
  const refreshToken = async () => {
    try {
      const res = await axios.post("http://localhost:8000/refreshz", { token: user.refreshToken });
      setUser({
        ...user,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const axiosJWT = axios.create()

  axiosJWT.interceptors.request.use(
    async (config) => {
      let currentDate = new Date();
      const decodedToken = jwt_decode(user.accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const data = await refreshToken();
        config.headers["authorization"] = "Bearer " + data.accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );


  ///login 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      if(username.length && password.length  > 0){

       
      const res = await axios.post("http://localhost:8000/login", { username, password });


       //set in local storage
      if (res.data.accessToken){
        localStorage.setItem("accessToken",res.data.accessToken)
      }
      setUser(res.data);
      }
      else{
        setError(true)
      }
    } catch (err) {
      console.log(err);
    }
  };



  //handle delete
  const handleDelete = async (id) => {
    setSuccess(false);
    setError(false);
    try {
     const res =await axiosJWT.delete("http://localhost:8000/users/" + id, {
        headers: { authorization: "Bearer " + user.accessToken },
      });
      console.log(res)
      setSuccess(true);
    } catch (err) {
      setError(true);
    }
  };


  //logout
  const handlelogout = async () => {

    try {
      const res = await axiosJWT.post("http://localhost:8000/logout",{ 
        headers: { authorization: "Bearer " + user.accessToken },
      });
        console.log(res)
      
      }catch(err){
   console.log(err)
      }
  
  }


console.log(user)

  return (
    <div className="container">

      <div className="formcont">
      {user ? (
        <div className="home">
          <h1 className="dash1">
            Welcome to the <b>{user.isAdmin ? "admin" : "user"}</b> dashboard{" "}
            <b className="user">{user.username}</b>.
          </h1>
          <h4>Delete Users:</h4>
          <button className="deleteButton1" onClick={() => handleDelete(1)}>
            Delete bibek
          </button>
          <button className="deleteButton" onClick={() => handleDelete(2)}>
            Delete asim
          </button>
        
         <div>

          <button className="logout" onClick={handlelogout}>logout</button>
         </div>
          {error && (
            <span className="error">
              You are not allowed to delete this user!
            </span>
          )}
          {success && (
            <span className="success">
              User has been deleted successfully...
            </span>
          )}
        </div>
      ) : (
        <div className="login">
          <form onSubmit={handleSubmit}>
            <h1 className="formTitle">jwt Login</h1>

            <div>
            <input
              type="text"
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
            />
            </div>
            <div className="btn">
            <input
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>
            <button type="submit" className="submitButton">
              Login
            </button>
            {error ? (
            <span className="error">
                plese fill the form
            </span>
          ):""}
          </form>
        </div>
      )}
    </div>
    </div>
  );
}

export default App;