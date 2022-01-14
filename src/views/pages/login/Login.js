import React, {useState} from 'react'
import {NavLink, Redirect} from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {setIsLoggedIn, setToken, setUser} from "../../../redux/actions/AuthActions";
import Loading from '../../../components/Common/Loading';
import './Login.css';
import {useSelector} from "react-redux";

const Login = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const auth = useSelector(state => state.AuthReducer);
  const session = JSON.parse(localStorage.getItem('session_exchange'));
  if (auth.token || (session && ('token' in session) && session.token)) {
    return <Redirect to={"/dashboard"}/>;
  }

  const _handleLogin = () => {
    setIsLoading(true);
    if (!username) {
      setErrorMessage('Please fill your E-mail!')
      setIsLoading(false);
      return false;
    }

    if (!password) {
      setErrorMessage('Please fill your password!')
      setIsLoading(false);
      return false;
    }

    fetch(process.env.REACT_APP_BACKEND_URL + "/auth/generate/token", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: username, password})
    })
      .then(resolve => resolve.json())
      .then(resolve => {
        //console.log(resolve);
        let {success, data, message} = resolve;
        if (!success) {
          setErrorMessage(message)
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setErrorMessage("");
          let user = {
            id: data.id,
            name: data.firstName + ' ' + data.lastName,
            role: data.role,
            mobilePhone: data.mobilePhone ? data.mobilePhone : null,
            email: data.email,
            token: data.token
          };
          setIsLoading(false);
          localStorage.setItem('session_exchange', JSON.stringify({
            'token': data.token,
            'isLoggedIn': true,
            'user': user
          }));
          setToken(data.token);
          setUser(user);
        }

      })
      .catch(error => {
        let {success, data, message} = error;
        setErrorMessage(message)
        setIsLoading(false);
      })

  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    {
                      errorMessage ?
                        <p className="error_message_paragraph">{errorMessage}</p>
                        :
                        null
                    }
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user"/>
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" placeholder="E-mail" autoComplete="E-mail"
                              onChange={(event) => setUsername(event.target.value)} value={username}/>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked"/>
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" placeholder="Password" autoComplete="current-password"
                              onChange={(event) => setPassword(event.target.value)} value={password}/>
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        {
                          isLoading ?
                            <Loading/>
                            :
                            <CButton color="primary" className="px-4" onClick={_handleLogin}>Login</CButton>
                        }
                      </CCol>
                      <CCol xs="6" className="text-right">
                        <NavLink to={"/password-reminder"}>Forgot password?</NavLink>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5 d-md-down-none" style={{width: '44%'}}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>Welcome to our CryptoCurrencyApp System. You can register here</p>
                    <NavLink to="/register" className="mt-3" style={{color: 'white'}}>
                      Register Now!
                    </NavLink>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
