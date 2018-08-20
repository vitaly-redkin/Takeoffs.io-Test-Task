/**
 * The Takeoff Floor Plan List component.
 */

import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Container, Card, CardBody, CardHeader, Row, Col } from 'reactstrap';

import { AppRoutes, composeTakeOffPath } from '../../util/AppRoutes';
import { BaseTakeoffComponent } from '../base-takeoff-component/BaseTakeoffComponent';
import { Service, ITakeoffFloorPlanResponseJson } from '../../util/Service';

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
      <Container className='pt-2 pb-2 mw-100 takeoff_floor-plan-list-container'>
        <Card className='w-100 h-100'>
          <CardHeader className='pb-1'>
            <Row>
              <Col className='col-9 mt-1'>
                <h4>Takeoff Floor Plan List</h4>
              </Col>
              <Col className='col-3'>
                <Row>
                  <Col className='col-7 text-right mt-2'>
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
          <CardBody className='takeoff_floor-plan-list-cardbody'>
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
        <div>
          {JSON.stringify(this.state.data)}}          
        </div>
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
