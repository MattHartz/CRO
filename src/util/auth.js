import React, { useState, useEffect, useContext, createContext } from "react";
import queryString from "query-string";
import * as firebase from "firebase/app";
import "firebase/auth";

// Replace with your own Firebase credentials
firebase.initializeApp({
  apiKey: "AIzaSyBKccJDgtas34GkYaKYCG-ZZ_oJP4Ym6l0",
  authDomain: "code-reviews-online.firebaseapp.com",
  projectId: "code-reviews-online",
  appID: "code-reviews-online"
});

// As httpOnly cookies are to be used, do not persist any state client side.
//firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

const authContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... update when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);

  const signin = (email, password) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        setUser(response.user);
        return response.user;
      });
  };

  const signinGithub = () => {
    var provider = new firebase.auth.GithubAuthProvider();
    provider.addScope('repo');

    return firebase
      .auth()
      .signInWithPopup(provider)
      .then(response => {

        localStorage.setItem('accessToken', response.credential.accessToken)
        //setUser(response.user);
        //getIdToken(response.user);

        //return response.user;
      });
  };

  const signup = (email, password) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(response => {
        setUser(response.user);
        return response.user;
      });
  };

  const signout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(false);
      });
  };

  const sendPasswordResetEmail = email => {
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        return true;
      });
  };

  const confirmPasswordReset = (password, code) => {
    // Get code from query string object
    const resetCode = code || getFromQueryString("oobCode");

    return firebase
      .auth()
      .confirmPasswordReset(resetCode, password)
      .then(() => {
        return true;
      });
  };

  const getIdToken = (user) => {

    if (user == null) return null;
    return user
      .getIdToken()
      .then((idToken) => {
        setIdToken(idToken);
      });
  };

  // Subscribe to user on mount
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
        getIdToken(user);

      } else {
        setUser(false);
        setIdToken(false);
      }
    });

    // Subscription unsubscribe function
    return () => unsubscribe();
  }, []);

  return {
    user,
    idToken,
    signin,
    signinGithub,
    signup,
    signout,
    sendPasswordResetEmail,
    getIdToken,
    confirmPasswordReset
  };
}

const getFromQueryString = key => {
  return queryString.parse(window.location.search)[key];
};
