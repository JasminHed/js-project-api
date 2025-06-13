import { useState } from "react";
import styled from "styled-components";

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
  background-color: #3a3f6b;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #2b2f5c;
    outline: 2px solid white;
  }
`;

const MessageCard = ({ message, onDelete, onEdit, isLoggedIn }) => {
  const [likes, setLikes] = useState(message.hearts);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.message);

  const handleLike = () => {
    fetch(
      `https://js-project-api-x10r.onrender.com/messages/${message._id}/like`,
      {
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then(() => setLikes(likes + 1))
      .catch((err) => console.error("Failed to like message", err));
  };

  const handleEdit = () => {
    onEdit(message._id, editedText);
    setIsEditing(false);
  };

  return (
    <Card>
      {isEditing ? (
        <>
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />

          <ButtonGroup>
            <ActionButton onClick={handleEdit}>Save</ActionButton>
            <ActionButton onClick={() => setIsEditing(false)}>
              Cancel
            </ActionButton>
          </ButtonGroup>
        </>
      ) : (
        <>
          <Message>
            {message.message} <Heart>❤️ {likes}</Heart>
          </Message>
          <ButtonGroup>
            <ActionButton type="button" onClick={handleLike}>
              Like ❤️
            </ActionButton>
            {isLoggedIn && (
              <>
                <ActionButton
                  type="button"
                  onClick={() => onDelete(message._id)}
                >
                  Delete
                </ActionButton>
                <ActionButton type="button" onClick={() => setIsEditing(true)}>
                  Edit
                </ActionButton>
              </>
            )}
          </ButtonGroup>
        </>
      )}
    </Card>
  );
};

export default MessageCard;
