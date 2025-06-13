import { useEffect, useState } from "react";
import styled from "styled-components";

import Form from "./components/Form.jsx";
import Login from "./components/Login.jsx";
import MessageCard from "./components/MessageCard.jsx";
import Register from "./components/Register.jsx";
import GlobalStyle from "./styles/GlobalStyle";

const GetButton = styled.button`
  display: block;
  margin: 1rem auto;
  border-radius: 20px;
  width: auto;
  padding: 12px;
  content: cover;
  border: none;
  margin: 0 auto;
  background-color: #ff7043;
  margin-top: 40px;
  margin-bottom: 40px;

  &:hover {
    background-color: #ff8a65;
    outline: 2px solid white;
  }
`;

const BASE_URL = "https://js-project-api-x10r.onrender.com";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [messageText, setMessageText] = useState("");
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken") //only shows edit+delete if log in
  );

  const handleMessage = (event) => {
    event.preventDefault();
    fetch(`${BASE_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"), //backend "this user is logged in" so they can pass authentication.
      },

      //sends id to backend to save message
      body: JSON.stringify({
        message: messageText,
        user: localStorage.getItem("userId"),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not post happy thought");
        return res.json();
      })
      .then(() => {
        fetchMessages();
        setMessageText("");
        setError(null);
      })

      .catch((err) => setError(err.message));
  };

  //handles messages
  const fetchMessages = () => {
    fetch(`${BASE_URL}/messages`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not found");
      })
      .then((data) => {
        setMessages(data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  //handles likes
  const handleClick = () => {
    fetch(`${BASE_URL}/messages?hearts=5`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not found");
      })
      .then((data) => {
        console.log("filtered data:", data);
        console.log("Number of messages:", data.length);
        setMessages(data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleShowAll = () => {
    fetchMessages(); // re-fetch all messages
  };

  //handles delete
  const deleteMessage = (id) => {
    fetch(`${BASE_URL}/messages/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("accessToken"),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete the message");
        return res.json();
      })
      .then(() => {
        fetchMessages();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  //handles edit
  const editMessage = (id, updatedText) => {
    const accessToken = localStorage.getItem("accessToken");

    fetch(`${BASE_URL}/messages/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
      body: JSON.stringify({ message: updatedText }),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            alert("Session expired. Please log in again.");
          }
          throw new Error("Failed to edit the message");
        }
        return res.json();
      })
      .then(() => {
        fetchMessages();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (loading) {
    return <p>Loading happy thoughts, don´t go anywhere!</p>;
  }

  return (
    <>
      <GlobalStyle />
      <h1>Your daily dose of happy thoughts!</h1>

      <Login setIsLoggedIn={setIsLoggedIn} />

      <Form
        isLoggedIn={isLoggedIn}
        messageText={messageText}
        setMessageText={setMessageText}
        handleMessage={handleMessage}
        error={error}
      />
      <GetButton onClick={handleClick}>Get messages with 5+ hearts</GetButton>
      <GetButton onClick={handleShowAll}>Show all messages</GetButton>

      {messages.length > 0 &&
        messages.map((message) => (
          <MessageCard
            isLoggedIn={isLoggedIn}
            key={message._id}
            message={message}
            onDelete={deleteMessage}
            onEdit={editMessage}
          />
        ))}
    </>
  );
};

export default App;
