/**
 * The Takeoff Tiled Area List component.
 */

import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Alert, Button, Container, Card, CardBody, CardHeader, Row, Col } from 'reactstrap';

import { AppRoutes, composeTakeOffPath } from '../../util/AppRoutes';
import { Service, ITakeoffTiledAreaResponseJson } from '../../util/Service';
import { BaseTakeoffComponent } from '../base-takeoff-component/BaseTakeoffComponent';
import TakeoffTiledArea from '../takeoff-tiled-area/TakeoffTiledArea';

import './TakeoffTiledAreaList.css';

class TakeoffTiledAreaList extends BaseTakeoffComponent<[ITakeoffTiledAreaResponseJson]> {

  /**
   * Renders "real" component content.
   */
  public renderInternal(): JSX.Element | null {
    if (!this.state || this.state.data === null) {
      return null;
    }

    return (
      <Container className='pt-2 pb-2 mw-100 takeoff-tiled-area-list-container'>
        <Card className='w-100 h-100'>
          <CardHeader className='pb-1'>
            <Row>
              <Col className='col-3 mt-1 pr-0'>
                <h5>Takeoff Tiled Area List</h5>
              </Col>
              <Col className='col-6 text-center pl-0 pr-0'>
                <Alert type='info' className='m-0 p-1 pl-2 pr-2 takeoff-tiled-area-description'>
                  Review detected floor plans.
                  Tiled areas are shown using semi-transparent gray masks.
                  You can edit these masks by adding (drawing rectangles holding no special keys)
                  or by subtracting (drawing rectangles holding Alt key).
                </Alert>
              </Col>
              <Col className='col-3 pl-1'>
                <Row>
                  <Col className='col-7 text-right mt-2 pr-0'>
                    <h6 className='pb-2'>Floor plans are defined?</h6>
                  </Col>
                  <Col className='col-5'>
                    <Button onClick={this.redirectToComplete} size='sm'>
                      Complete Takeoff
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </CardHeader>
          <CardBody className='takeoff-tiled-area-list-cardbody'>
            {this.renderList()}
          </CardBody>
        </Card>
      </Container>
    );
  }

  /**
   * Returns function which loads the component data.
   */
  public getDataLoader(): Function {
    const service: Service = new Service();

    return service.getTakeoffTiledAreas.bind(service);
  }

  /**
   * Renders tiled area list.
   */
  private renderList(): JSX.Element {
    if (this.state && this.state.data !== null && this.state.data.length > 0) {
      return (
        <Container className='pl-0 pr-0 mw-100'>
          {this.state.data.map((area: ITakeoffTiledAreaResponseJson) => (
            <TakeoffTiledArea key={area.floor_plan_number} area={area} takeoffId={this.takeoffId} />
          ))}
        </Container>
      );
    } else {
      return (
        <h6>No tiled areas defined</h6>      
      );
    }
  }

  /**
   * Redirects to the "Takeoff Complete" page.
   */
  private redirectToComplete = () => {
    const url: string = composeTakeOffPath(AppRoutes.TakeoffComplete, this.takeoffId);
    this.props.history.push(url);
  }
}

export default withRouter(TakeoffTiledAreaList);
