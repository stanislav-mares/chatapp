"use strict";
import React from "react";
import PropTypes from "prop-types";
import style from "styles/footer.scss";

const Footer = (props) => {

  let contClass = style.container;
  if (props.backgroundVis) {
    contClass += ' ' + style.backgroundVis;
  }

  return (
      <footer class={contClass}>
      	<span class={style.text}>&copy; Stanislav Mareš</span>
		  </footer>
    );
}

Footer.propTypes = {
    backgroundVis: PropTypes.bool
};

export default Footer;
