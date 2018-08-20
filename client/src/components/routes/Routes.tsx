/**
 * The component to contain routes.
 */

import * as React from 'react';
import { Switch, Redirect, Route, withRouter } from 'react-router-dom';

import { AppRoutes } from '../../util/AppRoutes';
import { RouteComponentDummyProps } from '../../util/CommonTypes';
import TakeoffCreator from '../takeoff-creator/TakeoffCreator';
import TakeoffStatus from '../takeoff-status/TakeoffStatus';
import TakeoffFloorPlanEditor from '../takeoff-floor-plan-editor/TakeoffFloorPlanEditor';
import TakeoffTiledAreaEditor from '../takeoff-tiled-area-editor/TakeoffTiledAreaEditor';
import TakeoffComplete from '../takeoff-complete/TakeoffComplete';

class Routes extends React.PureComponent<RouteComponentDummyProps> {
  public render(): JSX.Element {
    return (
      <Switch>
        <Route path={AppRoutes.TakeoffNew} component={TakeoffCreator} exact={true} />
        <Route path={AppRoutes.TakeoffStatus} component={TakeoffStatus} exact={true}/>
        <Route path={AppRoutes.TakeoffFloorPlans} component={TakeoffFloorPlanEditor}  exact={true} />
        <Route path={AppRoutes.TakeoffTiledAreas} component={TakeoffTiledAreaEditor}  exact={true} />
        <Route path={AppRoutes.TakeoffComplete} component={TakeoffComplete}  exact={true} />
        <Redirect to={AppRoutes.TakeoffNew} />
      </Switch>
    );
  }
}

export default withRouter(Routes);
