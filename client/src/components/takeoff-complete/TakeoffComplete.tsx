/**
 * The Takeoff complete component.
 */

import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Jumbotron, Button } from 'reactstrap';

import { AppRoutes } from '../../util/AppRoutes';
import { RouteComponentDummyProps } from '../../util/CommonTypes';

class TakeoffComplete extends React.PureComponent<RouteComponentDummyProps> {
  public render(): JSX.Element | null {
    return (
      <Jumbotron className='m-4 pt-4 pb-4'>
        <h4>Takeoff has been successfully completed</h4>
        <hr/>
        <h6 className='pb-2'>Ready to start a new one?</h6>
        <Button onClick={this.redirectToTakeoffNew} size='sm'>Create New Takeoff</Button>
      </Jumbotron>
    );
  }

  /**
   * Redirects to the "Create New Takeoff" page.
   */
  private redirectToTakeoffNew = () => {
    this.props.history.push(AppRoutes.TakeoffNew);
  }
}

export default withRouter(TakeoffComplete);
