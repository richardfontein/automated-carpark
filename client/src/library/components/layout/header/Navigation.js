import React, {
 useState, useEffect, useRef, useCallback, 
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
 Container, Dropdown, Navbar, Nav, Collapse, Button, 
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import menuIcon from '../../../../res/images/menu-icon-white.svg';
import logo from '../../../../res/images/logo-long.svg';

function Navigation(props) {
  const { isAuthenticated } = props;

  const navbarNode = useRef();
  const [navbarOpen, setNavbarOpen] = useState(false);

  const dropdownNode = useRef();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Closes dropdown menu if a click is detected outside of it
  // (anywhere on the page)
  const handleClick = useCallback(
    (e) => {
      if (navbarNode.current.contains(e.target)) {
        return;
      }
      setNavbarOpen(false);

      if (!(isAuthenticated && dropdownNode.current.contains(e.target))) {
        setDropdownOpen(false);
      }
    },
    [isAuthenticated],
  );

  useEffect(() => {
    // add when mounted
    document.addEventListener('mousedown', handleClick);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [handleClick]);

  const toggleNavbarDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  return (
    <Navbar expand="lg" variant="black" expanded={navbarOpen} onToggle={toggleNavbar}>
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>
            <img src={logo} alt="Logo" className="logo-image" />
          </Navbar.Brand>
        </LinkContainer>
        <div className="nav-wrapper" ref={navbarNode}>
          <Navbar.Toggle>
            <img src={menuIcon} alt="Logo" className="menu-icon" />
          </Navbar.Toggle>
          <Navbar.Collapse>
            <Nav>
              <div className="nav-main">
                <LinkContainer to="/pricing">
                  <Nav.Link>Pricing</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/support">
                  <Nav.Link>Support</Nav.Link>
                </LinkContainer>
              </div>

              {!isAuthenticated ? (
                <div className="nav-unauth">
                  <LinkContainer to="/dashboard/login">
                    <Button variant="hero-transparent">Log In</Button>
                  </LinkContainer>
                  <LinkContainer to="/dashboard/signup">
                    <Button variant="hero">Sign Up</Button>
                  </LinkContainer>
                </div>
              ) : (
                <div className="nav-dropdown">
                  <Button
                    variant="hero"
                    className="nav-dropdown-toggle"
                    onClick={toggleNavbarDropdown}
                  >
                    My Account
                    <FontAwesomeIcon icon="chevron-down" className="ml-2" />
                  </Button>

                  <Collapse in={dropdownOpen}>
                    <div className="nav-dropdown-menu" ref={dropdownNode}>
                      <LinkContainer to="/dashboard/tenancies">
                        <Dropdown.Item>
                          <FontAwesomeIcon icon="list" />
                          Tenancies
                        </Dropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/dashboard/account">
                        <Dropdown.Item>
                          <FontAwesomeIcon icon="user-edit" />
                          Account Settings
                        </Dropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/dashboard/logout">
                        <Dropdown.Item>
                          <FontAwesomeIcon icon="sign-out-alt" />
                          Log Out
                        </Dropdown.Item>
                      </LinkContainer>
                    </div>
                  </Collapse>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </div>
      </Container>
    </Navbar>
  );
}

Navigation.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(
  mapStateToProps,
  null,
)(Navigation);
