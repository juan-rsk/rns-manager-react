import React from 'react';
import propTypes from 'prop-types';
import {
  Navbar, Nav, Form, Container, Image,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { multilanguage } from 'redux-multilanguage';
import logo from '../../assets/img/logo.svg';
import LanguageSelectContainer from '../containers/LanguageSelectContainer';
import IndicatorLight from '../containers/IndicatorLight';
import { LoginDropdownContainer } from '../auth/containers';

const HeaderComponent = (props) => {
  const {
    strings,
  } = props;

  return (
    <Navbar
      expand="md"
      className="navbar-expand-md navbar-dark sticky-top"
    >
      <Container>
        <Link to="/" className="navbar-brand">
          <Image
            src={logo}
            className="logo"
            alt="RSK Logo"
          />
        </Link>
        <IndicatorLight />
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse className>
          <Nav className="ml-auto">
            <Nav.Item key={strings.search}>
              <Link to="/" className="nav-link" title={strings.search}>
                {strings.search}
              </Link>
            </Nav.Item>

            <Form onSubmit={e => e.preventDefault()} inline>
              <LanguageSelectContainer />
            </Form>

            <LoginDropdownContainer />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

HeaderComponent.propTypes = {
  strings: propTypes.shape().isRequired,
};

export default multilanguage(HeaderComponent);
