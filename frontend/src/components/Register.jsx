import { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    if (!formData.name || !formData.email || !formData.password) {
      console.log("validation failed");
      setError("Please fill in all fields");
      return;
    }
    console.log("fecth");

    fetch("https://js-project-api-x10r.onrender.com/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("accessToken", data.accessToken); //storage
          localStorage.setItem("userId", data.id); //storage
          setFormData({ name: "", email: "", password: "" });
          setError("Registration successful! Please log in"); //sucessmessage
        } else {
          setError(data.message);
        }
      })
      .catch(() => {
        setError("Network error. Please try again.");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}

      <label htmlFor="name">Name</label>
      <input
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        type="text"
        name="name"
        value={formData.name}
      />

      <label htmlFor="email">Email</label>
      <input
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        type="email"
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

      <button type="submit">Sign up</button>
    </form>
  );
};

export default Register;
