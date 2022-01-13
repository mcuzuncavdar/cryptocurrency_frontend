import React from "react";
import LoadingGif from '../../assets/images/loading-turn-arrows.gif';
import PropTypes from "prop-types";

const Loading = (props) => {

  const {width, height, containerStyle} = props;
  const gifStyle = {width, height};
  return (
    <div style={{...containerStyle, ...{display: "flex", justifyContent: "center", alignItems: "center"}}}>
      <img src={LoadingGif} alt={"Please wait..."} style={gifStyle}/>
    </div>
  );
}

Loading.propTypes = {
  containerStyle: PropTypes.object,
  width: PropTypes.string,
  height: PropTypes.string,
}

Loading.defaultProps = {
  containerStyle: {},
  width: '5rem',
  height: '5rem'
}

export default Loading;
