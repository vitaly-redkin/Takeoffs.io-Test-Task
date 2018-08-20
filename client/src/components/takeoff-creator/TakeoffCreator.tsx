/**
 * The Takeoff creator component.
 */

import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Jumbotron, FormGroup, Input, Label, Button, Alert } from 'reactstrap';

import { AppRoutes, composeTakeOffPath } from '../../util/AppRoutes';
import { RouteComponentDummyProps } from '../../util/CommonTypes';
import { Consts } from '../../util/Consts';
import { acceptFile, stripBase64ImagePrefix } from '../../util/Util';
import { Service, IUploadFileResponseJson, IUtilResponseJson } from '../../util/Service';
import LoadingPanel from '../loading-panel/LoadingPanel';

import './TakeoffCreator.css';

// Component state
interface ITakeOffCreatorState {
   // true if we are processing something now.
  isProcessing: boolean;
  // Name of the current operation.
  operationName: string | null;
  // Selected file
  file:
    {
      // File name
      fileName: string;
      // Base64-encoded file content
      content: string;
    } | undefined;
}

class TakeoffCreator extends React.PureComponent<RouteComponentDummyProps, ITakeOffCreatorState> {
  /**
   * Called when component is mounted. 
   * Sets an initial state.
   */
  public componentDidMount() {
    this.setState({file: undefined, isProcessing: false});
  }

  public render(): JSX.Element | null {
    if (!this.state) {
      return null;
    }

    if (this.state.isProcessing) {
      return (
        <LoadingPanel message={`${this.state.operationName}...`} />
      );
    }

    return (
      <React.Fragment>
        <Jumbotron className='m-4 pt-4 pb-4'>
          <FormGroup className='takeoff-creator-form-group'>
            <h5><Label for='fileInput'>Choose Plan</Label></h5>
            <Input type='file' 
                  id='fileInput'
                  accept={this.acceptedExtensions}
                  multiple={false}
                  onChange={this.onFileSelected}
            />
            <p>Submit plan image file (PNG, GIF or JPEG) for evaluation</p>
            <Button onClick={this.createNewTakeoff} size='sm'>Submit Plan</Button>
          </FormGroup>
        </Jumbotron>
        <Alert color='warning'  className='m-4 pt-4 pb-4'>
          <div className='mb-4'>
            Plans may take a lot of space in the database.<br/>
            When the cloud-based MongoDB instance (MongoDB Atlas) is used you have only 512MB of space available.<br/>
            So it may have sense to clean up the database from the old takeoffs before submitting a new plan.<br/>
            To do this click the button below. <strong>USE WITH CAUTION!!!</strong> <br/>
          </div>
          <Button onClick={this.cleanUpDatabase} color='danger' size='sm'>Clean up Database</Button>
        </Alert>
      </React.Fragment>
    );
  }

  /**
   * Handler for the FileSelected event
   *
   * @param evt Object with event details
   */
  private onFileSelected = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    if (evt && evt.target && evt.target.files && evt.target.files.length === 1) {
      const file: File = evt.target.files[0];
      if (acceptFile(file)) {
        const fileName = file.name;

        const reader: FileReader = new FileReader();
        reader.onload = () : void => {
          const base64: string = reader.result as string;
          const content = stripBase64ImagePrefix(base64);
          this.setState({file: {fileName, content}});
        };
        reader.readAsDataURL(file as Blob);
  
      } else {
        this.setState({file: undefined});
        alert(`This is not an image file: ${file.name}
              \nOnly PNG, GIF, JPG and JPEG extensions supported`);
      }
    }
  }

  /**
   * Called when Takeoff has been successfully created.
   * 
   * @param response Object response data
   */
  private onTakeoffCreated = (response: IUploadFileResponseJson): void => {
    const takeoffId = response.takeoff_id;
    const statusUrl = composeTakeOffPath(AppRoutes.TakeoffStatus, takeoffId);
    this.props.history.push(statusUrl);
  }

  /**
   * Called when Takeoff creation failed.
   * 
   * @param error Error details
   */
  private onTakeoffFailed = (error: Error): void => {
    this.onServiceCallFailed(error);
  }

  /**
   * Creates new Takeoff.
   */
  private createNewTakeoff = () => {
    if (!this.state.file) {
      alert('Please select an image file with plan to submit first');

      return;
    }

    this.startProcessing('Creating Takeoff');

    new Service().createTakeoff(
      this.state.file.fileName, this.state.file.content, 
      this.onTakeoffCreated, this.onTakeoffFailed);
  }

  /**
   * Returns comma-separated list of accepted image file extensions
   */
  private get acceptedExtensions(): string {
    return Consts.ACCEPTED_MIME_TYPES.replace('image/', '.');
  }

  /**
   * Cleans up the database.
   */
  private cleanUpDatabase = (): void => {
    if (confirm('Do you REALLY want to CLEAN UP THE DATABASE?')) {
      this.startProcessing('Cleaning up the database');
      new Service().cleanUpDatabase(
        this.onDatabaseCleanedUp, this.onDatabaseCleanUpFailed);
    }
  }

  /**
   * Called when database clean up call has been successful.
   * 
   * @param response Object response data
   */
  private onDatabaseCleanedUp = (response: IUtilResponseJson): void => {
    if (response.success) {
      this.stopProcessing();
    } else {
      this.onDatabaseCleanUpFailed(new Error(response.error));
    }
  }

  /**
   * Called when database cleanup failed.
   * 
   * @param error Error details
   */
  private onDatabaseCleanUpFailed = (error: Error): void => {
    this.onServiceCallFailed(error);
  }

  /**
   * Called when service call failed.
   * 
   * @param error Error details
   */
  private onServiceCallFailed = (error: Error): void => {
    console.log(error);
    alert(`Error occurred when ${this.state.operationName}. Check console for details.`);
    this.stopProcessing();
  }

  /**
   * Updates the component state for started processing.
   * 
   * @param operationName Name of the current operation
   */
  private startProcessing = (operationName: string): void => {
    this.setState({isProcessing: true, operationName});
  }

  /**
   * Updates the component state for stopped processing.
   */
  private stopProcessing = (): void => {
    this.setState({isProcessing: false, operationName: null});
  }
}

export default withRouter(TakeoffCreator);
