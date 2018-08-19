/**
 * The takeoff creator component.
 */

import * as React from 'react';
import { Link } from 'react-router-dom';

import { AppRoutes, composeTakeOffPath } from '../../util/AppRoutes';

// Component own props
interface IOwnProps {
}

class TakeoffCreator extends React.PureComponent<IOwnProps> {
  public render(): JSX.Element {
    const takeoffId: string = '1';
    const statusUrl = composeTakeOffPath(AppRoutes.TakeoffStatus, takeoffId);

    return (
      <div>
        Takeoff Creator
        <Link to={statusUrl}>Show Takeoff status</Link>
      </div>
    );
  }
}

export default TakeoffCreator;
