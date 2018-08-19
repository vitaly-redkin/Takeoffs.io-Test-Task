/**
 * The takeoff status component.
 */

import * as React from 'react';

import { TakeoffRouteProps } from '../../util/CommonTypes';

class TakeoffStatus extends React.PureComponent<TakeoffRouteProps> {
  public render(): JSX.Element {
    return (
      <div>
        Takeoff Status: {this.takeoffId}
      </div>
    );
  }

  get takeoffId(): string {
    return this.props.match.params.takeoffId;
  }
}

export default TakeoffStatus;
