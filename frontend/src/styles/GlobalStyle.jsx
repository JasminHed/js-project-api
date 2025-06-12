import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  font-size: 16px;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 24px;
  margin-left: 10px;
  margin-top: 20px;
  margin-bottom: 40px;
}

@media (min-width: 668px) {
  h1 {
    font-size: 32px;
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 40px;
  }
}


@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}
`;

export default GlobalStyle;
