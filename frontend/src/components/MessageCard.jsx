import styled from "styled-components";
import { useState } from "react";

const Card = styled.div`
  border: 1px solid whitesmoke;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem auto;
  width: 85%;
  max-width: 500px;
  background-color: #1e1e1e;
  color: white;
  box-shadow: 2px 2px 0 0 whitesmoke;
  margin-top: 30px;
`;

const Message = styled.p`
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
`;

const Heart = styled.span`
  font-size: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 0.5rem;
`;

const ActionButton = styled.button`
  background-color: #747bff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #535bf2;
  }
`;

const MessageCard = ({ message, onDelete, onEdit }) => {
  const [likes, setLikes] = useState(message.hearts);

  const handleLike = () => {
    fetch(
      `https://js-project-api-x10r.onrender.com/messages/${message._id}/like`,
      {
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then(() => setLikes(likes + 1)) // 👈 uppdatera räkningen lokalt
      .catch((err) => console.error("Failed to like message", err));
  };

  return (
    <Card>
      <Message>
        {message.message} <Heart>❤️ {likes}</Heart>
      </Message>
      <ButtonGroup>
        <ActionButton onClick={handleLike}>Like ❤️</ActionButton>
        <ActionButton onClick={() => onDelete(message._id)}>
          Delete
        </ActionButton>
        <ActionButton onClick={() => onEdit(message._id)}>Edit</ActionButton>
      </ButtonGroup>
    </Card>
  );
};

export default MessageCard;
