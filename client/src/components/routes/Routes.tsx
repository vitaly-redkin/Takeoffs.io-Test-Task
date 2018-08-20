/**
 * The component to contain routes.
 */

import * as React from 'react';
import { Switch, Redirect, Route, withRouter } from 'react-router-dom';

import { AppRoutes } from '../../util/AppRoutes';
import { RouteComponentDummyProps } from '../../util/CommonTypes';
import TakeoffCreator from '../takeoff-creator/TakeoffCreator';
import TakeoffStatus from '../takeoff-status/TakeoffStatus';
import TakeoffFloorPlanList from '../takeoff-floor-plan-list/TakeoffFloorPlanList';
import TakeoffTiledAreaList from '../takeoff-tiled-area-list/TakeoffTiledAreaList';
import TakeoffComplete from '../takeoff-complete/TakeoffComplete';

class Routes extends React.PureComponent<RouteComponentDummyProps> {
  public render(): JSX.Element {
    return (
      <Switch>
        <Route path={AppRoutes.TakeoffNew} component={TakeoffCreator} exact={true} />
        <Route path={AppRoutes.TakeoffStatus} component={TakeoffStatus} exact={true}/>
        <Route path={AppRoutes.TakeoffFloorPlans} component={TakeoffFloorPlanList}  exact={true} />
        <Route path={AppRoutes.TakeoffTiledAreas} component={TakeoffTiledAreaList}  exact={true} />
        <Route path={AppRoutes.TakeoffComplete} component={TakeoffComplete}  exact={true} />
        <Redirect to={AppRoutes.TakeoffNew} />
      </Switch>
    );
  }
}

export default withRouter(Routes);
