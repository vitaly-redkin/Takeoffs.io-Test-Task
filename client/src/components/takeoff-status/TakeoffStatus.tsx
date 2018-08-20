/**
 * The Takeoff status component.
 */

import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Jumbotron, Button } from 'reactstrap';

import { BaseTakeoffEditor } from '../base-takeoff-editor/BaseTakeoffEditor';
import { Service, ITakeoffStatusStepResponseJson } from '../../util/Service';
import { AppRoutes, composeTakeOffPath } from '../../util/AppRoutes';

class TakeoffStatus extends BaseTakeoffEditor<[ITakeoffStatusStepResponseJson]> {

  private refreshDataInterval: number | undefined;

  /**
   * Called when component is mounted. 
   * Sets an initial state and loads the data.
   */
  public componentDidMount() {
    super.componentDidMount();

    this.refreshDataInterval = window.setInterval(this.refreshData, 1000);
  }

  /**
   * Called when components is about to be unmounted.
   */
  public componentWillUnmount() {
    this.clearInterval();
  }

  /**
   * Renders "real" component content.
   */
  public renderInternal(): JSX.Element | null {
    if (!this.state || this.state.data === null) {
      return null;
    }

    const statusMessage: string = 
      (this.areAllStepsCompleted() ? 'has been processed successfully' : 'is beeng processed now');
    const floorsReady = this.areFloorsExtracted;
    const tiledAreasReady = this.areTiledAreasCalculated;

    return (
      <Jumbotron className='m-4 pt-4 pb-4'>
        <h4>New Takeoff has been successfully submitted</h4>
        <hr/>
        <h6>The uploaded file {statusMessage}.</h6>
        <ul>
          {this.state.data.map(s => {
            return (
              <li key={s.step_name}>{`${s.step_name}: ${s.message}`}</li>
            );
          })}
        </ul>
        <hr/>
        {floorsReady && 
         <Button onClick={this.redirectToTakeoffFloorPlanEditor} size='sm' className='mr-2'>Review Floor Plans</Button>}
        {tiledAreasReady && 
         <Button onClick={this.redirectToTakeoffTiledAreaEditor} size='sm' className='mr-2'>Review Tiled Areas</Button>}
        {floorsReady && tiledAreasReady &&
         <Button onClick={this.redirectToTakeoffComplete} size='sm' className='mr-2'>Complete This Takeoff</Button>}
      </Jumbotron>
    );
  }

  /**
   * Returns function which loads the component data.
   */
  public getDataLoader(): Function {
    const service: Service = new Service();

    return service.getTakeoffStatus.bind(service);
  }

  /**
   * true if 'Extracting Floor Plans' step is completed.
   */
  private get areFloorsExtracted(): boolean {
    return this.isStepCompleted('Extracting Floor Plans');
  }

  /**
   * true if 'Calculating Tiled Area' step is completed.
   */
  private get areTiledAreasCalculated(): boolean {
    return this.isStepCompleted('Calculating Tiled Area');
  }

  /**
   * Returns true if the given step is completed.
   * 
   * @param stepName name of the step to check.
   */
  private isStepCompleted(stepName: string): boolean {
    return (
      this.state &&
      this.state.data !== null && 
      this.state.data.findIndex(s => s.step_name === stepName && s.loaded) >= 0
    );
  }

  /**
   * Returns true if the all steps are completed.
   */
  private areAllStepsCompleted(): boolean {
    return (
      this.state &&
      this.state.data !== null && 
      this.state.data.findIndex(s => !s.loaded) < 0);
  }

  /**
   * Reloads the component data if not all steps are completed yet.
   * If they are clears the refresh data timeout.
   */
  private refreshData = () => {
    if (this.areAllStepsCompleted()) {
      this.clearInterval();
    } else {
      this.loadData();
    }
  }

  private clearInterval = () => {
    if (this.refreshDataInterval !== undefined) {
      window.clearInterval(this.refreshDataInterval);
      this.refreshDataInterval = undefined;
    }
  }

  /**
   * Redirects to the "Takeoff Floor Plan Editor" page.
   */
  private redirectToTakeoffFloorPlanEditor = () => {
    const url: string = composeTakeOffPath(AppRoutes.TakeoffFloorPlans, this.takeoffId);
    this.props.history.push(url);
  }

  /**
   * Redirects to the "Takeoff Tiled Area Editor" page.
   */
  private redirectToTakeoffTiledAreaEditor = () => {
    const url: string = composeTakeOffPath(AppRoutes.TakeoffTiledAreas, this.takeoffId);
    this.props.history.push(url);
  }

  /**
   * Redirects to the "Takeoff Complete" page.
   */
  private redirectToTakeoffComplete = () => {
    const url: string = composeTakeOffPath(AppRoutes.TakeoffComplete, this.takeoffId);
    this.props.history.push(url);
  }
}

export default withRouter(TakeoffStatus);
