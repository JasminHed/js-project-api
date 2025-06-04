import { useEffect, useState } from "react";

import Form from "./components/Form.jsx";

const BASE_URL = "https://js-project-api-x10r.onrender.com";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [messageText, setMessageText] = useState("");
  const [error, setError] = useState(null);

  const handleMessage = (event) => {
    event.preventDefault();
    fetch(`${BASE_URL}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: messageText }),
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

  if (loading) {
    return <p>Loading happy thoughts, don´t go anywhere!</p>;
  }

  return (
    <>
      <h1>Your daily dose of happy thoughts!</h1>
      <Form
        messageText={messageText}
        setMessageText={setMessageText}
        handleMessage={handleMessage}
        error={error}
      />
      <button onClick={handleClick}>Get messages with 5+ hearts</button>

      {messages.length > 0 &&
        messages.map((message) => (
          <p key={message._id}>
            {message.message} ❤️ {message.hearts}
          </p>
        ))}
    </>
  );
};

export default App;
