/**
 * The loading panel component.
 */

import * as React from 'react';
import { Progress, Alert } from 'reactstrap';

// Component state
interface ILoadingPanelProps {
  message: string;
}

class LoadingPanel extends React.PureComponent<ILoadingPanelProps> {

  public render(): JSX.Element | null {
    return (
      <Alert color='info' className='m-4 p-4'>
        <Progress animated={true} color='info' value={100} className='w-100 mt-2' />
        <h6 className='w-100 text-center mt-4 mb-0 pb-0'>{this.props.message}</h6>
      </Alert>
    );
  }
}

export default LoadingPanel;
