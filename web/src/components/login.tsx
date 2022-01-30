import * as React from "react";
import { postJSON } from "../api";
import "./login.css";

export function Login() {
  // Set initial values for the email address & password.
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Specify what should happen when the user clicks the login button.
  const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await postJSON("login", { email, password });

    if (result.token) {
      document.cookie = `token=${result.token}; max-age=31536000`;
    }
    console.log(`Login request returned: `, result);
  };

  return (
    <form onSubmit={loginHandler}>
      <div className="email">
        <label htmlFor="email">Email:</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          id="email"
        >
        </input>
      </div>
      <div className="password">
        <label htmlFor="password">Password:</label>
        <input
          required
          type="password"
          name="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        >
        </input>
      </div>
      <input type="submit" value="Login" />
    </form>
  );
}
