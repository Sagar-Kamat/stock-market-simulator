import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styles from "./App.module.css";
import { Login, Register, NotFound, PageTemplate } from "./components";
import UserContext from "./context/UserContext";
import Axios from "axios";

function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  const url = "http://localhost:5000/api";

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token == null) {
        localStorage.setItem("auth-token", "");
        token = "";
        setUserData({ token: undefined, user: undefined });
        return;
      }

      const headers = {
        "x-auth-token": token,
      };
      console.log("here");
      const tokenIsValid = await Axios.post(url + "/auth/validate", null, {
        headers,
      });
      console.log(tokenIsValid);
      if (tokenIsValid.data) {
        const userRes = await Axios.get(url + "/auth/user", { headers });
        setUserData({
          token,
          user: userRes.data,
        });
      } else {
        setUserData({ token: undefined, user: undefined });
      }
      console.log("end");
    };

    checkLoggedIn();
  }, []);

  return (
    <Router>
      <UserContext.Provider value={{ userData, setUserData }}>
        <div className={styles.container}>
          <Switch>
            {userData.user ? (
              <Route path="/" exact component={PageTemplate} />
            ) : (
              <Route path="/" exact component={Register} />
            )}
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
