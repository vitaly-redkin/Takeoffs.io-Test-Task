/**
 * The Takeoff Floor Plan component.
 */

import * as React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';

import { addBase64ImagePrefix, getImageSize } from '../../util/Util';
import { ITakeoffFloorPlanResponseJson } from '../../util/Service';
import { BaseProcessor, IBaseProcessorState } from '../base-processor/BaseProcessor';

import './TakeoffFloorPlan.css';

// Component props
interface ITakeoffFloorPlanProps {
  takeoffId: string;
  plan: ITakeoffFloorPlanResponseJson;
}

// Component state
interface ITakeoffFloorPlanState extends IBaseProcessorState {
  svgHeight: string;
}

class TakeoffFloorPlan extends BaseProcessor<ITakeoffFloorPlanProps, ITakeoffFloorPlanState> {
//  private imageElement: SVGImageElement;
  
  constructor(props: ITakeoffFloorPlanProps) {
    super(props);
    this.state = {svgHeight: '100vh', isProcessing: false, operationName: ''};
  }

  /**
   * Component mounted hook.
   */
  public async componentDidMount() {
    super.componentDidMount();
    await this.setImageDimensions();
  }

  /**
   * Renders "real" component content.
   */
  public renderInternal(): JSX.Element | null {
    return (
      <Card className='w-100 mb-4'>
        <CardHeader className='pb-1'>
          <h6>Page {this.props.plan.page_number}</h6>
        </CardHeader>
        <CardBody>
          {this.renderPlan()}
        </CardBody>
      </Card>
    );
  }

  /**
   * Renders floor plan.
   */
  private renderPlan(): JSX.Element | null {
    if (!this.state) {
      return null;
    }

    return (
      <div>
        <svg className='takeoff-floor-plan-svg'
             style={{height: this.state.svgHeight}}>
            <image className='takeoff-floor-plan-image' 
                   xlinkHref={addBase64ImagePrefix(this.props.plan.page_data)}
                   ref={this.setImageRef}
            />
        </svg>
      </div>
    );
  }

  /**
   * Sets image element reference.
   * 
   * @param imageElement image element to set reference to
   */
  private setImageRef = (imageElement: SVGImageElement): void => {
//    this.imageElement = imageElement;
//    this.setImageDimensions();
  }

  /**
   * Sets image dimansions.
   */
  private async setImageDimensions() {
    const imageBounds = await getImageSize(this.props.plan.page_data);
    this.setState({svgHeight: `${imageBounds.height}px`});
  }
}

export default TakeoffFloorPlan;
