import React, {useEffect, useState} from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
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
import Loading from "../../../components/Common/Loading";
import './Register.css';
import {NavLink} from "react-router-dom";
import {setToken, setUser as setReduxUser} from "../../../redux/actions/AuthActions";
import {useSelector} from "react-redux";

const Register = (props) => {
  const auth = useSelector(state => state.AuthReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [messageType, setMessageType] = useState('error');
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: ""
  });

  const _handleOnChange = (event) => {
    let value = event.target.value;
    let id = event.target.id;
    setUser(prevState => {
      return {
        ...prevState,
        [id]: value
      }
    })
  }

  const _handleRegister = () => {
    setIsLoading(true);
    if (!user.firstName) {
      setResponseMessage('Please fill your firstname!')
      setIsLoading(false);
      return false;
    }

    if (!user.lastName) {
      setResponseMessage('Please fill your lastname!')
      setIsLoading(false);
      return false;
    }

    if (!user.email || !user.email.includes("@")) {
      setResponseMessage('Your email is not valid!')
      setIsLoading(false);
      return false;
    }

    if (!user.password) {
      setResponseMessage('Please fill your password!')
      setIsLoading(false);
      return false;
    }

    if (!user.repeatPassword) {
      setResponseMessage('Please fill your repeat password!')
      setIsLoading(false);
      return false;
    }

    if ((user.password !== user.repeatPassword)) {
      setResponseMessage("Your passwords don't match!")
      setIsLoading(false);
      return false;
    }

    setResponseMessage("")
    setMessageType("error");
    fetch(process.env.REACT_APP_BACKEND_URL + "/auth/register", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then(resolve => resolve.json())
      .then(resolve => {
        let {success, data, message} = resolve;
        if (!success) {
          setResponseMessage(message)
        } else {
          setResponseMessage('Registered successfully');
          setMessageType("success");
          setReduxUser(data.user);
          setToken(data.token);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        let {success, data, message} = error;
        setResponseMessage(message)
        setIsLoading(false);
      })
  }

  useEffect(() => {
    if (auth.token) {
      setTimeout(() => {
        props.history.push('/dashboard');
      }, 1000);
    }
    return () => {
    };
  }, [auth.token]);


  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="9" lg="7" xl="6">
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Register</h1>
                  <p className="text-muted">Create your account</p>
                  {
                    responseMessage ?
                      <p className={messageType === 'error' ? "error_message_paragraph" : "success_message_paragraph"}>
                        {responseMessage}
                      </p>
                      :
                      null
                  }
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-user"/>
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      type="text"
                      placeholder="Firstname"
                      autoComplete="Firstname"
                      id="firstName"
                      value={user.firstName}
                      onChange={_handleOnChange}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-user"/>
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      type="text"
                      placeholder="Lastname"
                      autoComplete="Lastname"
                      id="lastName"
                      value={user.lastName}
                      onChange={_handleOnChange}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>@</CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      type="email"
                      placeholder="Email"
                      autoComplete="email"
                      id="email"
                      value={user.email}
                      onChange={_handleOnChange}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked"/>
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      id="password"
                      value={user.password}
                      onChange={_handleOnChange}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked"/>
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      id="repeatPassword"
                      value={user.repeatPassword}
                      onChange={_handleOnChange}
                    />
                  </CInputGroup>

                  {
                    isLoading ?
                      <Loading/>
                      :
                      <CButton color="success" block onClick={_handleRegister}>Create Account</CButton>
                  }
                </CForm>
              </CCardBody>

              <CCardFooter className="p-4">
                <CRow>
                  <CCol xs="12" sm="6">
                    <NavLink to="/login" className="mt-3">Already registered</NavLink>
                  </CCol>
                  {/*<CCol xs="12" sm="6">
                    <CButton className="btn-facebook mb-1" block><span>facebook</span></CButton>
                  </CCol>*/}
                  {/*<CCol xs="12" sm="6">
                    <CButton className="btn-twitter mb-1" block><span>twitter</span></CButton>
                  </CCol>*/}
                </CRow>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
