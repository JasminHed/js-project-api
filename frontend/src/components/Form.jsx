import styled from "styled-components";

const FormWrapper = styled.form`
  border-radius: 3px;
  border: 1px solid whitesmoke;
  box-shadow: 2px 2px 0 0 whitesmoke;
  width: 95%;
  max-width: 500px;
  margin: 0 auto;

  @media (min-width: 480px) {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
    max-width: 600px;
    width: 100%;

    width: auto;
    max-width: 500px;
    margin-left: 10px;
    margin: 0 auto;
  }

  @media (min-width: 1024px) and (max-width: 1600px) {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
    max-width: 600px;
    width: 100%;

    width: auto;
    max-width: 500px;
    margin-left: 10px;
    margin: 0 auto;
  }
`;

const Label = styled.label`
  margin: 10px 7px 7px 12px;
`;

const Textarea = styled.textarea`
  margin: 7px 7px 7px 12px;
  resize: none;
  width: 90%;
  height: 60px;
  background-color: whitesmoke;
  color: black;

  @media (min-width: 360px) {
    margin-left: 12px;
  }

  @media (min-width: 1024px) and (max-width: 1600px) {
    margin-left: 12px;
  }
`;

const Button = styled.button`
  border-radius: 20px;
  cursor: pointer;
  width: auto;
  padding: 12px;
  content: cover;
  border: none;
  margin-bottom: 20px;
  margin-left: 10px;

  Button:focus {
    border: 2px solid #646cff;
  }

  @media (min-width: 360px) {
    width: auto;
    max-width: 500px;
    margin-left: 10px;
  }

  @media (min-width: 1024px) and (max-width: 1600px) {
    width: auto;
    max-width: 500px;
    margin-left: 10px;
  }
`;
const Error = styled.p`
  color: var(--color-text);
  margin-left: 10px;
`;

// Form to send message and handle message
const Form = ({ messageText, setMessageText, handleMessage, error }) => {
  return (
    <FormWrapper onSubmit={handleMessage}>
      <Label htmlFor="input">What's making you happy right now?</Label>
      <Textarea
        id="input"
        value={messageText}
        onChange={(event) => setMessageText(event.target.value)}
      />
      <Button type="submit"> ❤️ Send Happy Thought! ❤️</Button>
      {error && <Error>{error.toString()}</Error>}
    </FormWrapper>
  );
};

export default Form;
