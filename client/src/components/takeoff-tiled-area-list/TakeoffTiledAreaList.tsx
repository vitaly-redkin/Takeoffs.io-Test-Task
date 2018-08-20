/**
 * The Takeoff Tiled Area Editor component.
 */

import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Jumbotron, Button } from 'reactstrap';

import { AppRoutes, composeTakeOffPath } from '../../util/AppRoutes';
import { RouteComponentDummyProps } from '../../util/CommonTypes';

class TakeoffTiledAreaList extends React.PureComponent<RouteComponentDummyProps> {
  public render(): JSX.Element | null {
    return (
      <Jumbotron className='m-4 pt-4 pb-4'>
        <h4>Takeoff Tiled Area List</h4>
        <hr/>
        <h6 className='pb-2'>Tiled area are defined?</h6>
        <Button onClick={this.redirectToTakeoffComplete} size='sm'>Complete Takeoff</Button>
      </Jumbotron>
    );
  }

  private get takeoffId(): string {
    return '1';
  }

  /**
   * Redirects to the "Takeoff Complete" page.
   */
  private redirectToTakeoffComplete = () => {
    const url: string = composeTakeOffPath(AppRoutes.TakeoffComplete, this.takeoffId);
    this.props.history.push(url);
  }
}

export default withRouter(TakeoffTiledAreaList);
