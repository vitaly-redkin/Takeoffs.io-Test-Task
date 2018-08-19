import * as React from 'react';
import { Navbar, NavbarBrand, Nav, Button } from 'reactstrap';
import { withRouter } from 'react-router-dom';

import { AppRoutes } from '../../util/AppRoutes';
import { RouteComponentDummyProps } from '../../util/CommonTypes';

import './AppHeader.css';

import logo from '../../img/logo.png';

class AppHeader extends React.Component<RouteComponentDummyProps> {
  public render() {
    return (
      <Navbar color='dark' dark={true} expand='md' fixed='top'>
        <NavbarBrand href={'https://www.takeoffs.io'} target='_blank' className='app-header-left'>
          <img alt='TakeOffs.io Logo' src={logo} />
        </NavbarBrand>
        <Nav className='app-header-title mt-4'>
          <h2>Plan Processing Test Task</h2>
        </Nav>
        {this.props.location.pathname !== AppRoutes.TakeoffNew &&
        <Nav className='app-header-right'>
          <div>
            <Button onClick={this.redirectToTakeoffNew} size='sm'>Create New Takeoff</Button>
          </div>
        </Nav>
        }
      </Navbar>
    );
  }

  private redirectToTakeoffNew = () => {
    this.props.history.push(AppRoutes.TakeoffNew);
  }
}

export default withRouter(AppHeader);
