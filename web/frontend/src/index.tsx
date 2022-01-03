import React from 'react';
import ReactDOM from 'react-dom';
import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import App from './App';
import './index.css';

ReactDOM.render(
  <StyledEngineProvider injectFirst>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </StyledEngineProvider>,
  document.getElementById('root')
);
