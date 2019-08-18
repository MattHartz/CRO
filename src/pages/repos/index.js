import React, { useEffect } from "react";
import ReposSection from "./../../components/ReposSection";
import { useAuth } from "./../../util/auth.js";
import { useRouter } from "./../../util/router.js";
import "./styles.scss";
import * as github from "github-api";

function ReposPage(props) {
  const auth = useAuth();
  const router = useRouter();

  // Redirect to signin
  // if not signed in.
  useEffect(() => {
    if (auth.user === false) {
      router.push("/signin");
    }
  }, [auth]);

  let repos = [];
  if (auth.idToken) {
    const git = new github({
      token: localStorage.getItem("accessToken")
    })

    var me = git.getUser();
    me.listRepos(function(err, result) {
      repos = result
    });
  }

  //let idToken = auth.getIdToken(auth.user);

  return (
    <ReposSection
      color="white"
      size="large"
      title="Repos"
      subtitle="Here is a list of all your repos"
      user={auth.user == null ? null : auth.user.displayName}
      idToken={auth.idToken}
      repos={repos}
    />
  );
}

export default ReposPage;
