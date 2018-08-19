/**
 * The component to contain routes.
 */

import * as React from 'react';
import { Switch, Redirect, Route, withRouter } from 'react-router-dom';

import { AppRoutes } from '../../util/AppRoutes';
import { RouteComponentDummyProps } from '../../util/CommonTypes';
import TakeoffCreator from '../takeoff-creator/TakeoffCreator';
import TakeoffStatus from '../takeoff-status/TakeoffStatus';

class Routes extends React.PureComponent<RouteComponentDummyProps> {
  public render(): JSX.Element {
    return (
      <Switch>
        <Route path={AppRoutes.TakeoffNew} component={TakeoffCreator} exact={true} />
        <Route path={AppRoutes.TakeoffStatus} component={TakeoffStatus} />
        <Redirect to={AppRoutes.TakeoffNew} />
      </Switch>
    );
  }
}

export default withRouter(Routes);
