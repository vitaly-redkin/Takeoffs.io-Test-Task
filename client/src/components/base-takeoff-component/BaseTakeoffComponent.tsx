/**
 * Base component for the takeoff components.
 * 
 * I know Component inheritance is "frown upon" by Facebook 
 * but it is a simplest way to go in this case.
 */
import { TakeoffRouteProps } from '../../util/CommonTypes';
import { BaseProcessor, IBaseProcessorState } from '../base-processor/BaseProcessor';

// Component state
interface ITakeoffState<TData> extends IBaseProcessorState {
  // Component own data
  data: TData | null;
}

export class BaseTakeoffComponent<TData> extends BaseProcessor<TakeoffRouteProps, ITakeoffState<TData>> {

  /**
   * Called when component is mounted. 
   * Sets an initial state and loads the data.
   */
  public componentDidMount() {
    this.setState({isProcessing: true, operationName: 'Loading data', data: null});

    this.loadData();
  }

  /**
   * Loads component data.
   */
  public loadData = () => {
    this.getDataLoader()(this.takeoffId, this.onDataLoadingCompleted, this.onDataLoadingFailed);
  }

  /**
   * Returns function which loads the component data.
   */
  public getDataLoader(): Function {
    throw new Error('getDataLoader() method should be in e overriden BaseTakeoffEditor descedants');
  }

  /**
   * Called when data loading completed.
   * 
   * @param response Object response data
   */
  private onDataLoadingCompleted = (response: TData): void => {
    this.setState({data: response});
    this.stopProcessing();
  }

  /**
   * Called when database cleanup failed.
   * 
   * @param error Error details
   */
  private onDataLoadingFailed = (error: Error): void => {
    this.onServiceCallFailed(error);
  }

  /**
   * Returns ID of the current takeoff.
   */
  public get takeoffId(): string {
    return this.props.match.params.takeoffId;
  }
}
