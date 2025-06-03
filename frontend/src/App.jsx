import { useState, useEffect } from "react";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = () => {
    setLoading(true);

    console.log("API with hearts=5");

    fetch("https://jasmin-apiproject.onrender.com/messages")
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
    fetch("http://localhost:8080/messages?hearts=5") //("https://jasmin-apiproject.onrender.com/messages?hearts=5")
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
