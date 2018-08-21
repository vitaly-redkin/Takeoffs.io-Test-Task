/**
 * The Takeoff Floor Plan List component.
 */

import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Alert, Button, Container, Card, CardBody, CardHeader, Row, Col } from 'reactstrap';

import { AppRoutes, composeTakeOffPath } from '../../util/AppRoutes';
import { Service, ITakeoffFloorPlanResponseJson } from '../../util/Service';
import { BaseTakeoffComponent } from '../base-takeoff-component/BaseTakeoffComponent';
import TakeoffFloorPlan from '../takeoff-floor-plan/TakeoffFloorPlan';

import './TakeoffFloorPlanList.css';

class TakeoffFloorPlanList extends BaseTakeoffComponent<[ITakeoffFloorPlanResponseJson]> {

  /**
   * Renders "real" component content.
   */
  public renderInternal(): JSX.Element | null {
    if (!this.state || this.state.data === null) {
      return null;
    }

    return (
      <Container className='pt-2 pb-2 mw-100 takeoff-floor-plan-list-container'>
        <Card className='w-100 h-100'>
          <CardHeader className='pb-1'>
            <Row>
              <Col className='col-3 mt-1 pr-0'>
                <h5>Takeoff Floor Plan List</h5>
              </Col>
              <Col className='col-6 text-center pl-0 pr-0'>
                <Alert type='info' className='m-0 p-1 pl-2 pr-2 takeoff-floor-plan-description'>
                  Review detected pages and plans.
                  If there are any plans missing you can manually add more by clicking on the images. 
                  You can also delete a plan by clicking on (X) in the top right corner.
                </Alert>
              </Col>
              <Col className='col-3 pl-1'>
                <Row>
                  <Col className='col-7 text-right mt-2 pr-0'>
                    <h6 className='pb-2'>Floor plans are defined?</h6>
                  </Col>
                  <Col className='col-5'>
                    <Button onClick={this.redirectToTakeoffTiledAreaList} size='sm'>
                      Go to Tiled Areas
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </CardHeader>
          <CardBody className='takeoff-floor-plan-list-cardbody'>
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

    return service.getTakeoffFloorPlans.bind(service);
  }

  /**
   * Renders floor plan list.
   */
  private renderList(): JSX.Element {
    if (this.state && this.state.data !== null && this.state.data.length > 0) {
      return (
        <Container className='pl-0 pr-0 mw-100'>
          {this.state.data.map((plan: ITakeoffFloorPlanResponseJson) => (
            <TakeoffFloorPlan key={plan.page_number} plan={plan} takeoffId={this.takeoffId} />
          ))}
        </Container>
      );
    } else {
      return (
        <h6>No floor plans extracted</h6>      
      );
    }
  }

  /**
   * Redirects to the "Takeoff Tiled Area List" page.
   */
  private redirectToTakeoffTiledAreaList = () => {
    const url: string = composeTakeOffPath(AppRoutes.TakeoffTiledAreas, this.takeoffId);
    this.props.history.push(url);
  }
}

export default withRouter(TakeoffFloorPlanList);
