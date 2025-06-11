import { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in both fields");
      return;
    }

    setError("");

    fetch("https://js-project-api-x10r.onrender.com/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.notFound) {
          setError("Invalid email or password");
        } else {
          localStorage.setItem("userId", data.userId); //stores user ID in local storage
          localStorage.setItem("accessToken", data.accessToken);
        }
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>LOG IN</h1>
      {error && <div style={{ color: "black" }}>{error}</div>}
      <label htmlFor="email">Email</label>
      <input
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        type="text"
        name="email"
        value={formData.email}
      />
      <label htmlFor="password">Password</label>
      <input
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        type="password"
        name="password"
        value={formData.password}
      />
      <button type="submit">Log In</button>
    </form>
  );
};

export default Login;
