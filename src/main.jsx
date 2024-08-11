import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './i18n';
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="1051460649548-ijlrpmgdcmd5td1apidcpauh3dhv7u26.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
)
