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
  background-color: #646cff;
  margin-top: 40px;
  margin-bottom: 40px;

  &:hover {
    background-color: #3d3fa6;
  }

  Button:focus {
    border: 2px solid white;
  }
`;

const EditError = styled.p`
  color: white;
  margin-top: 10px;
`;

const BASE_URL = "https://js-project-api-x10r.onrender.com";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [messageText, setMessageText] = useState("");
  const [error, setError] = useState(null);
  const [editError, setEditError] = useState(null);

  const handleMessage = (event) => {
    event.preventDefault();
    fetch(`${BASE_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"), //backend "this user is logged in" so they can pass authentication.
      },

      body: JSON.stringify({
        message: messageText,
        user: localStorage.getItem("userId"), //backend "this message belongs to this specific user" so it gets saved with the correct owner.
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

  const fetchMessages = () => {
    setLoading(true);

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

  const handleClick = () => {
    setLoading(true);
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

  const editMessage = (id, updatedText) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setEditError("You must be logged in to edit a message.");
      return;
    }

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
      {editError && <EditError>{editError}</EditError>}

      <Login />
      <Form
        messageText={messageText}
        setMessageText={setMessageText}
        handleMessage={handleMessage}
        error={error}
      />
      <GetButton onClick={handleClick}>Get messages with 5+ hearts</GetButton>

      {messages.length > 0 &&
        messages.map((message) => (
          <MessageCard
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
