import React from "react";
import {CCard, CCardBody, CCardHeader, CCol, CDataTable} from "@coreui/react";
import {DocsLink} from "../../reusable";
import PropTypes from "prop-types";
import {NavLink} from "react-router-dom";
import "./ListCard.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
const ListCard = (props) => {

  const {title, listItems, to, icon, iconColor} = props;

  return (
    <CCol xs="12" sm="6" md="6">
      <CCard className={"card"}>
        <CCardHeader className={"card-header"}>
          <FontAwesomeIcon icon={icon}
                           style={{fontSize: "1rem", color: iconColor}}/>
          <span className={"title"}>{title}</span>
          <NavLink to={to}>More > </NavLink>
        </CCardHeader>
        <CCardBody>
          <table className={"table table-borderless table-hover"}>
            <tbody>
            {
              !listItems?
                <tr>
                  <td colSpan={"4"}>No Info</td>
                </tr>
                :
              listItems.map((item, index) => {
                return (
                  <tr key={`listItem${index}`}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.code}</td>
                    <td>{item.rate}</td>
                  </tr>
                )
              })
            }
            </tbody>
          </table>
        </CCardBody>
      </CCard>
    </CCol>

  )
}

ListCard.propTypes = {
  title: PropTypes.string.isRequired,
  listItems: PropTypes.array.isRequired,
  to: PropTypes.string,
  icon: PropTypes.object,
  iconColor: PropTypes.string,
}

ListCard.defaultProps = {
  to: "",
  iconColor: '#666666'
}

export default ListCard;
