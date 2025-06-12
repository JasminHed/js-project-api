import { useState } from "react";
import styled from "styled-components";

import Register from "./Register.jsx";

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

const LogoutButton = styled.button`
  margin-top: 10px;
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
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
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

const ErrorDiv = styled.div`
  color: white;
`;

const RegisterLink = styled.p`
  font-size: 12px;
  margin-top: 10px;
`;

const LinkSpan = styled.span`
  color: #007bff;
  cursor: pointer;
`;

const Login = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
          setIsLoggedIn(true);
          setFormData({ email: "", password: "" });
        }
      });
  };

  //funtion for logging out
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setFormData({ email: "", password: "" });
  };

  return (
    <>
      <LoginButton onClick={() => setIsOpen(true)}>Log In</LoginButton>
      {isOpen && (
        <PopUp onClick={() => setIsOpen(false)}>
          <Form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
            {!showRegister ? (
              <>
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
                {error && <ErrorDiv>{error}</ErrorDiv>}
                <button type="submit">Log In</button>
                {isLoggedIn && (
                  <LogoutButton type="button" onClick={handleLogout}>
                    Logout
                  </LogoutButton>
                )}
                <RegisterLink>
                  No account?{" "}
                  <LinkSpan onClick={() => setShowRegister(true)}>
                    Register here
                  </LinkSpan>
                </RegisterLink>
              </>
            ) : (
              <Register setShowRegister={setShowRegister} />
            )}
          </Form>
        </PopUp>
      )}
    </>
  );
};

export default Login;
