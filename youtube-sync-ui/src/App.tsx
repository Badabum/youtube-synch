import { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import  GoogleLogin, {GoogleLoginResponse, GoogleLoginResponseOffline, GoogleLogout} from 'react-google-login'
import axios from 'axios'
import {Container, createTheme, Stack, ThemeProvider} from "@mui/material";
interface User{
  name: string,
  email: string,
  displayName: string,
  accessToken: string,
  refreshToken: string
}
const theme = createTheme({
  palette:{
    mode: 'dark'
  }
});
function App() {
  const [count, setCount] = useState(0)
  const [token, setToken] = useState('')

  const successAuth = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    setToken(response.code!)
  }
  const failedAuth = (response:any) => {
    console.log(JSON.stringify(response))
  }
  useEffect(() => {
    axios.post<User>('http://localhost:3001/users', {
      authorizationCode: token
    }).then(user => console.log(user))
  }, [token]);
  return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="md" sx={{bgcolor: 'background.default', color: 'text.primary'}}>
          <Stack
              py={2}
              direction={"row"} justifyContent={'flex-end'} alignItems={'center'}>
            {token
                ?  <GoogleLogout
                    clientId='79131856482-fo4akvhmeokn24dvfo83v61g03c6k7o0.apps.googleusercontent.com'
                    onLogoutSuccess={() => setToken('')}></GoogleLogout>
                : <GoogleLogin
                    clientId='79131856482-fo4akvhmeokn24dvfo83v61g03c6k7o0.apps.googleusercontent.com'
                    onSuccess={successAuth}
                    accessType='offline'
                    responseType='code'
                    prompt={'consent'}
                    onFailure={failedAuth}
                    cookiePolicy='single_host_origin'
                    scope='https://www.googleapis.com/auth/youtube.readonly'/>
            }
          </Stack>
          <Container>
            Hello
          </Container>
        </Container>
      </ThemeProvider>

  )
}

export default App
