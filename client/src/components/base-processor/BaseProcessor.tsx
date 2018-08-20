/**
 * Base component to be inherited by other components which call Service class methods
 * and have LoadinfPanel to show while processed.
 * 
 * I know Component inheritance is "frown upon" by Facebook 
 * but it is a simplest way to go in this case.
 */

import * as React from 'react';

import LoadingPanel from '../loading-panel/LoadingPanel';

// Component state
export interface IBaseProcessorState {
   // true if we are processing something now
  isProcessing: boolean;
  // Name of the current operation
  operationName: string | null;
}

export class BaseProcessor<TProps, TState extends IBaseProcessorState> 
  extends React.PureComponent<TProps, TState> {

  /**
   * Called when component is mounted. 
   * Sets an initial state.
   */
  public componentDidMount() {
    this.setState({isProcessing: false});
  }

  /**
   * Renders component.
   */
  public render(): JSX.Element | null {
    if (this.state && this.state.isProcessing) {
      return (
        <LoadingPanel message={`${this.state.operationName}...`} />
      );
    } else {
      return this.renderInternal();
    }
  }

  /**
   * Renders "real" component content.
   */
  public renderInternal(): JSX.Element | null {
    throw new Error('renderInternal() method should be in e overriden BaseProcessor descedants');
  }

  /**
   * Called when service call failed.
   * 
   * @param error Error details
   */
  public onServiceCallFailed = (error: Error): void => {
    console.log(error);
    alert(`Error occurred when ${this.state.operationName}. Check console for details.`);
    this.stopProcessing();
  }

  /**
   * Updates the component state for started processing.
   * 
   * @param operationName Name of the current operation
   */
  public startProcessing = (operationName: string): void => {
    this.setState({isProcessing: true, operationName});
  }

  /**
   * Updates the component state for stopped processing.
   */
  public stopProcessing = (): void => {
    this.setState({isProcessing: false, operationName: null});
  }
}
