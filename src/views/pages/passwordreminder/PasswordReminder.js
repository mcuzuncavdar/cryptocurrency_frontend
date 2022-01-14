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
import Loading from '../../../components/Common/Loading';
import './PasswordReminder.css';

const PasswordReminder = () => {

  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [messageType, setMessageType] = useState('error');

  const _handleReminder = async () => {
    setIsLoading(true);
    if (!username) {
      setResponseMessage('Please fill your E-mail!')
      setIsLoading(false);
      return false;
    }
    setResponseMessage('')
    setMessageType("error");

    fetch(process.env.REACT_APP_BACKEND_URL + "/email/reminder/sendgrid", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: [username],
        subject: 'Password Reminder',
        cc: [],
        bcc: [],
        replyTo: "",
        from: 'mertznr@hotmail.com',
        emailBodyText: '',
        emailBodyHtml: '',
        templateId: '',
        substitutions: {}
      })
    })
      .then(resolve => resolve.json())
      .then(resolve => {
        let {success, data, message} = resolve;
        if (!success) {
          setResponseMessage(message)
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setResponseMessage(message);
          setMessageType("success");
        }

      })
      .catch(error => {
        let {success, data, message} = error;
        setResponseMessage(message)
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
                    <h1>Reminder</h1>
                    <p className="text-muted"></p>
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
                      <CInput type="text" placeholder="E-mail" autoComplete="E-mail"
                              onChange={(event) => setUsername(event.target.value)} value={username}/>
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        {
                          isLoading ?
                            <Loading/>
                            :
                            <CButton color="primary" className="px-4" onClick={_handleReminder}>Send Mail</CButton>
                        }
                      </CCol>
                      <CCol xs="6" className="text-right">
                        <NavLink to={"/login"}>Login Page</NavLink>
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

export default PasswordReminder
