import * as React from "react";
import "./login.css";

export interface LoginProps {
  email: string;
  password: string;
  error: string;
}

export function Login(props: LoginProps) {
  // Set initial values for the email address & password.
  const [email, setEmail] = React.useState(props.email ?? "");
  const [password, setPassword] = React.useState(props.password ?? "");

  // Set initial text of our error message.
  const [error, setError] = React.useState(props.error ?? "");

  // Specify what should happen when the user clicks the login button.
  const loginHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    Login({ email, password, error });
  };

  return (
    <form onSubmit={loginHandler}>
      <div className="email">
        <label htmlFor="email">Email:</label>
        <input
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
