import { useState } from "react";
import styled from "styled-components";

const LoginButton = styled.button`
  position: fixed;
  top: 10px;
  left: 10px;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const PopUp = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

const Form = styled.form`
  background: inherit;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  margin-top: 25px;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const Login = () => {
  const [isOpen, setIsOpen] = useState(false);
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
        console.log("log in");
        if (data.notFound) {
          setError("Invalid email or password");
        } else {
          localStorage.setItem("userId", data.userId); //stores user ID in local storage
          localStorage.setItem("accessToken", data.accessToken);
          setError("Login successful!"); // Add success message
        }
      });
  };

  return (
    <>
      <LoginButton onClick={() => setIsOpen(true)}>Log In</LoginButton>
      {isOpen && (
        <PopUp onClick={() => setIsOpen(false)}>
          <Form onSubmit={handleSubmit}>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <Label htmlFor="email">Email</Label>
            <Input
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              type="text"
              name="email"
              value={formData.email}
            />
            <Label htmlFor="password">Password</Label>
            <Input
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              type="password"
              name="password"
              value={formData.password}
            />
            <button type="submit">Log In</button>
          </Form>
        </PopUp>
      )}
    </>
  );
};

export default Login;
