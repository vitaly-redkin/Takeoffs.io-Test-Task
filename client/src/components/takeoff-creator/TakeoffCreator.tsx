/**
 * The takeoff creator component.
 */

import * as React from 'react';
//import { Redirect } from 'react-router-dom';
import { Jumbotron, FormGroup, Input, Label, Button } from 'reactstrap';

//import { AppRoutes, composeTakeOffPath } from '../../util/AppRoutes';
import { Consts } from '../../util/Consts';
import { acceptFile } from '../../util/Util';
import { Service, IUploadFileResponseJson } from '../../util/Service';

import './TakeoffCreator.css';

// Component state
interface ITakeOffCreatorState {
  file:
    {
      fileName: string;
      file: File;
    } | undefined;
}

class TakeoffCreator extends React.PureComponent<{}, ITakeOffCreatorState> {
  public componentDidMount() {
    this.setState({file: undefined});
  }

  public render(): JSX.Element {
//    const takeoffId: string = '1';
//    const statusUrl = composeTakeOffPath(AppRoutes.TakeoffStatus, takeoffId);

    return (
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
          <Button onClick={this.createNewTakeoff}>Submit Plan</Button>
        </FormGroup>
      </Jumbotron>
    );
  }

  /**
   * Handler for the FileSeleced event
   *
   * @param evt Object with event details
   */
  private onFileSelected = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    if (evt && evt.target && evt.target.files && evt.target.files.length === 1) {
      const file: File = evt.target.files[0];
      if (acceptFile(file)) {
        const fileName = file.name;
        this.setState({file: {fileName, file}});
      } else {
        this.setState({file: undefined});
        alert(`This is not an image file: ${file.name}
              \nOnly PNG, GIF, JPG and JPEG extensions supported`);
      }
    }
  }

  private onTakeoffCreated = (response: IUploadFileResponseJson): void => {
    console.log(response);
  }

  private onTakeoffFailed = (error: Error): void => {
    console.log(error);
    alert('Error occurred when creating Takeoff. Check console for details.');
}

  private createNewTakeoff = () => {
    if (!this.state.file) {
      alert('Please select an image file with plan to submit first');

      return;
    }

    new Service().createTakeoff(
      this.state.file.fileName, this.state.file.file, 
      this.onTakeoffCreated, this.onTakeoffFailed);
  }

  /**
   * Returns comma-separated list of accepted image file extensions
   */
  private get acceptedExtensions() : string {
    return Consts.ACCEPTED_MIME_TYPES.replace('image/', '.');
  }
}

export default TakeoffCreator;
