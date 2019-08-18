function postIdTokenToSessionLogin(data) {
    return fetch("/sessionLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(r => r.json());
  }
  
  export default { postIdTokenToSessionLogin };