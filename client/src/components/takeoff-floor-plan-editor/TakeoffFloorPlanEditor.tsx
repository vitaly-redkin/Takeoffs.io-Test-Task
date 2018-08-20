/**
 * The Takeoff Floor Plan Editor component.
 */

import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Jumbotron, Button } from 'reactstrap';

import { AppRoutes, composeTakeOffPath } from '../../util/AppRoutes';
import { RouteComponentDummyProps } from '../../util/CommonTypes';

class TakeoffFloorPlanEditor extends React.PureComponent<RouteComponentDummyProps> {
  public render(): JSX.Element | null {
    return (
      <Jumbotron className='m-4 pt-4 pb-4'>
        <h4>Takeoff Floor Plan Editor</h4>
        <hr/>
        <h6 className='pb-2'>Floor plans are defined?</h6>
        <Button onClick={this.redirectToTakeoffTiledAreaEditor} size='sm'>Go to Tiled Areas</Button>
      </Jumbotron>
    );
  }

  private get takeoffId(): string {
    return '1';
  }

  /**
   * Redirects to the "Takeoff Floor Plan Editor" page.
   */
  private redirectToTakeoffTiledAreaEditor = () => {
    const url: string = composeTakeOffPath(AppRoutes.TakeoffTiledAreas, this.takeoffId);
    this.props.history.push(url);
  }
}

export default withRouter(TakeoffFloorPlanEditor);
