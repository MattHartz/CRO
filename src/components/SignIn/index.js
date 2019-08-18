import React, { useState } from "react";
import Auth from "./../Auth";
import { useAuth } from "./../../util/auth.js";
import "./styles.scss";

function SignIn(props) {
  const auth = useAuth();
  const [status, setStatus] = useState();

  const onSubmit = ({ email, pass }) => {
    setStatus({ type: "pending" });
    auth
      .signin(email, pass)
      .then(user => {
        props.onSignin && props.onSignin();
      })
      .catch(error => {
        setStatus({
          type: "error",
          message: error.message
        });
      });
  };

  const onSubmitGithub = () => {
    setStatus({ type: "pending" });
    auth
      .signinGithub()
      .then(user => {
        props.onSignin && props.onSignin(user);
      })
      .catch(error => {
        setStatus({
          type: "error",
          message: error.message
        });
      });
  };

  const onSubmitGoogle = () => {
    setStatus({ type: "pending" });
    auth
      .signinGoogle()
      .then(user => {
        props.onSignin && props.onSignin();
      })
      .catch(error => {
        setStatus({
          type: "error",
          message: error.message
        });
      });
  };

  return (
    <Auth
      mode="signin"
      buttonText={props.buttonText}
      parentColor={props.parentColor}
      onSubmit={onSubmit}
      onSubmitGithub={onSubmitGithub}
      onSubmitGoogle={onSubmitGoogle}
      status={status}
    />
  );
}

export default SignIn;
