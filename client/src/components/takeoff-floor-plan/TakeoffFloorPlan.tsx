/**
 * The Takeoff Floor Plan component.
 */

import * as React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import * as lodash from 'lodash';

import { addBase64ImagePrefix, getImageSize } from '../../util/Util';
import { ITakeoffFloorPlanResponseJson } from '../../util/Service';
import { BaseProcessor, IBaseProcessorState } from '../base-processor/BaseProcessor';
import SvgRect, { SvgRectData } from '../svg-rect/SvgRect';

import './TakeoffFloorPlan.css';
import { ISize } from '../../util/CommonTypes';

// Component props
interface ITakeoffFloorPlanProps {
  takeoffId: string;
  plan: ITakeoffFloorPlanResponseJson;
}

// Component state
interface ITakeoffFloorPlanState extends IBaseProcessorState {
  scale: number;
  svgWidth: string;
  svgHeight: string;
  bboxes: [number][];
}

class TakeoffFloorPlan extends BaseProcessor<ITakeoffFloorPlanProps, ITakeoffFloorPlanState> {
//  private imageElement: SVGImageElement;
  private containerDivElement: HTMLDivElement;

  /**
   * Debounced Resize event handler
   */
  private debouncedResizehandler = lodash.debounce(this.onResizeHanler.bind(this), 100);

  /**
   * Component mounted hook.
   */
  public async componentDidMount() {
    super.componentDidMount();

    window.addEventListener('resize', this.debouncedResizehandler);
    this.setState({bboxes: this.props.plan.bboxes});
  }

  /**
   * Component to be unmouted hook.
   */
  public componentWillUnmount() : void {
    window.removeEventListener('resize', this.debouncedResizehandler);
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
        <CardBody className='p-2'>
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

    const rects: SvgRectData[] = this.getSvgRectsByBbboxes();

    return (
      <div ref={this.setContainerDivRef} className='w-100 text-center'>
        <svg className='takeoff-floor-plan-svg'
             style={{width: this.state.svgWidth, height: this.state.svgHeight}}>
          <image className='takeoff-floor-plan-image' 
                  xlinkHref={addBase64ImagePrefix(this.props.plan.page_data)}
                  ref={this.setImageRef}
                  style={{width: this.state.svgWidth, height: this.state.svgHeight}}
          />

          <svg>
           {rects.map((rect) => <SvgRect key={rect.rectId} {...rect} />)}
          </svg>
        </svg>
      </div>
    );
  }

  /**
   * Composes array of SvgRectData objects by the floor plan bboxes.
   */
  private getSvgRectsByBbboxes = (): SvgRectData[] => {
    const scale: number = this.state.scale;
    if (scale === undefined) {
      return [];
    }

    return this.state.bboxes.map<SvgRectData>((bbox: [number], index: number): SvgRectData => {
      const onDeleteHandler: Function = 
        (rectId: number) => { this.deleteBbox(rectId); };

      return {
        rectId: index,
        x: bbox[0],
        y: bbox[1],
        w: bbox[2],
        h: bbox[3],
        scale: scale,
        color: 'blue',
        cursor: 'default',
        onDeleteHandler: onDeleteHandler
      };
    });    
  }

  private deleteBbox = (rectId: number) => {
    this.setState((prevState: ITakeoffFloorPlanState) => {
      const newBboxes = prevState.bboxes.filter(
        (_: [number], index: number): boolean => index !== rectId);

      return {...prevState, bboxes: newBboxes};
    });
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
   * Sets container DIV element reference.
   * 
   * @param containerDivElement container DIV element to set reference to
   */
  private setContainerDivRef = async (containerDivElement: HTMLDivElement) => {
      this.containerDivElement = containerDivElement;
      await this.setImageDimensions();
  }

  /**
   * Handler of the Resize event
   */
  private async onResizeHanler() {
    await this.setImageDimensions();
  }

  /**
   * Sets image dimensions.
   */
  private async setImageDimensions() {
    if (!this.containerDivElement) {
      return;
    }

    const divSize: ISize = { 
      width: this.containerDivElement.getBoundingClientRect().width, 
      height: document.body.scrollHeight - 260 // This is a rough approximation of the viewport height we may use
    };
    const imageSize = await getImageSize(this.props.plan.page_data);

    const scaleX: number = divSize.width / imageSize.width;
    const scaleY: number = divSize.height / imageSize.height;
    const scale: number = Math.min(scaleX, scaleY, 1);

    const width: number = Math.round(imageSize.width * scale);
    const height: number = Math.round(imageSize.height * scale);

    this.setState({
      scale: scale,
      svgWidth: `${width}px`,
      svgHeight: `${height}px`,
    });
  }
}

export default TakeoffFloorPlan;
