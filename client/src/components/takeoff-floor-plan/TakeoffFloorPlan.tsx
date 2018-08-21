/**
 * The Takeoff Floor Plan component.
 */

import * as React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import * as lodash from 'lodash';

import { addBase64ImagePrefix, getImageSize } from '../../util/Util';
import { ITakeoffFloorPlanResponseJson, Service } from '../../util/Service';
import { BaseProcessor, IBaseProcessorState } from '../base-processor/BaseProcessor';
import SvgRect, { SvgRectData } from '../svg-rect/SvgRect';

import './TakeoffFloorPlan.css';
import { ISize, IPoint } from '../../util/CommonTypes';

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
  bboxes: number[][];
  isInDrawing: boolean;
  currentRect: IPoint[];
}

class TakeoffFloorPlan extends BaseProcessor<ITakeoffFloorPlanProps, ITakeoffFloorPlanState> {
  private svgElement: SVGElement;
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

    this.setState({bboxes: this.props.plan.bboxes});

    window.addEventListener('resize', this.debouncedResizehandler);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  /**
   * Component to be unmouted hook.
   */
  public componentWillUnmount() : void {
    window.removeEventListener('resize', this.debouncedResizehandler);
    document.removeEventListener('mouseup', this.onMouseUp);
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
             style={{width: this.state.svgWidth, height: this.state.svgHeight}}
             ref={this.setSvgRef}
             onMouseDown={this.onMouseDown} onMouseMove={this.onMouseMove}>
             >
          <image className='takeoff-floor-plan-image' 
                  xlinkHref={addBase64ImagePrefix(this.props.plan.page_data)}
                  style={{width: this.state.svgWidth, height: this.state.svgHeight}}
          />

          <svg>
           {rects.map((rect) => <SvgRect key={rect.rectId} {...rect} />)}
          </svg>

          {this.renderCurrentRect()}
        </svg>
      </div>
    );
  }

  /**
   * Sets SVG element reference.
   * 
   * @param svgElement SVG element to set reference to
   */
  private setSvgRef = (svgElement: SVGSVGElement): void => {
    this.svgElement = svgElement;
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
   * Composes array of SvgRectData objects by the floor plan bboxes.
   */
  private getSvgRectsByBbboxes = (): SvgRectData[] => {
    const scale: number = this.state.scale;
    if (scale === undefined) {
      return [];
    }

    return this.state.bboxes.map<SvgRectData>((bbox: [number], index: number): SvgRectData => {
      const x = Math.round(bbox[0] * scale);
      const y = Math.round(bbox[1] * scale);
      const w = Math.round(bbox[2] * scale);
      const h = Math.round(bbox[3] * scale);
  
      const onDeleteHandler: Function = 
        (rectId: number) => { this.deleteBbox(rectId); };

      return {
        rectId: index,
        x: x,
        y: y,
        w: w,
        h: h,
        color: 'blue',
        cursor: 'default',
        onDeleteHandler: onDeleteHandler
      };
    });    
  }

  /**
   * Renders rectangle we are drawing now.
   */
  private renderCurrentRect = (): JSX.Element | null => {
    if (!this.state.currentRect || this.state.currentRect.length !== 2) {
      return null;
    }

    const r: IPoint[] = this.state.currentRect;
    const x: number = Math.min(r[0].x, r[1].x);
    const y: number = Math.min(r[0].y, r[1].y);
    const w: number = Math.abs(r[0].x - r[1].x);
    const h: number = Math.abs(r[0].y - r[1].y);

    const rect: SvgRectData = {
      rectId: -1,
      x: x,
      y: y,
      w: w,
      h: h,
      color: 'blue',
      cursor: 'default',
      onDeleteHandler: null
    };

    return (
      <SvgRect {...rect} />
    );
  }

  /**
   * Calls service to update bboxes after change.
   */
  private updateBboxes = () => {
    this.setState({operationName: 'Saving bboxes'});

    new Service().setTakeoffFloorPlanBboxes(
      this.props.takeoffId,
      this.props.plan.page_number,
      this.state.bboxes,
      () => null,
      this.onServiceCallFailed
    );
  }

  /**
   * Deletes bbox with the given index.
   * 
   * @param rectId - ID of the bbox rectangle (index in the bbox array)
   */
  private deleteBbox = (rectId: number) => {
    this.setState(
      (prevState: ITakeoffFloorPlanState) => {
        const newBboxes: number[][] = prevState.bboxes.filter(
          (_: number[], index: number): boolean => index !== rectId);
        
        return {...prevState, bboxes: newBboxes};
      },
      () => {
        this.updateBboxes();
      });
  }

  /**
   * Handler of the Resize event888
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

  /**
   * MouseDown event handler. Starts drawing a new rectangle.
   * 
   * @param mouseEvent - event arguments. any type is used because svg element 
   * requires MouseEvent<SVGElement> type and the compiler says MouseEvent 
   * is not a genertic type.
   */
  //tslint:disable
  private onMouseDown = (mouseEvent: any): void => {
  //tslint:enable
    if (mouseEvent.button !== 0) {
        return;
    }

    if (!this.state.isInDrawing) {
        const point: IPoint = this.convertToRelative(mouseEvent);

        this.setState((prevState: ITakeoffFloorPlanState) => {
          return {
            ...prevState, 
            isInDrawing: true, 
            currentRect: [point]};
        });
    }
  }

  /**
   * MouseUp event handler. Finishes new rectangle drawing.
   * 
   * @param mouseEvent - event arguments. any type is used because svg element 
   * requires MouseEvent<SVGElement> type and the compiler says MouseEvent 
   * is not a genertic type.
   */
  private onMouseUp = (mouseEvent: MouseEvent): void => {
    if (mouseEvent.button !== 0) {
        return;
    }

    let bboxAdded = false;
    if (this.state.isInDrawing &&
        (this.state.currentRect.length === 2)) {
      const scale: number = this.state.scale;
      const r: IPoint[] = this.state.currentRect;
      const x: number = Math.round(Math.min(r[0].x, r[1].x) / scale);
      const y: number = Math.round(Math.min(r[0].y, r[1].y) / scale);
      const w: number = Math.round(Math.abs(r[0].x - r[1].x) / scale);
      const h: number = Math.round(Math.abs(r[0].y - r[1].y) / scale);

      // Check if added bbox is large enough
      // Helps to avoid "new rectangle iis added when a delete icon for existing one clicked" mess
      if (w > 2 && h > 2) {
        bboxAdded = true;

        this.setState(
          (prevState: ITakeoffFloorPlanState) => {
            const newBbox = [x, y, w, h];
            const newBboxes = prevState.bboxes.concat([newBbox]);

            return {
              ...prevState, 
              bboxes: newBboxes,
              isInDrawing: false, 
              currentRect: []};
            },
          () => {
            this.updateBboxes();
          });
      }
    }

    if (!bboxAdded) {
      this.setState((prevState: ITakeoffFloorPlanState) => {
        return {
          ...prevState, 
          isInDrawing: false, 
          currentRect: []};
      });
    }
  }

  /**
   * MouseMove event handler.
   * 
   * @param mouseEvent - event arguments. any type is used because svg element 
   * requires MouseEvent<SVGElement> type and the compiler says MouseEvent 
   * is not a genertic type.
   */
  //tslint:disable
  private onMouseMove = (mouseEvent: any): void => {
  //tslint:enable
    if (this.state.isInDrawing) {
      const point: IPoint = this.convertToRelative(mouseEvent);

      this.setState((prevState: ITakeoffFloorPlanState) => {
        return {
          ...prevState, 
          isInDrawing: true, 
          currentRect: prevState.currentRect.slice(0, 1).concat(point)};
      });
    }
  }

  /**
   * Converts mouse event cordinates to relative ones against SVG.
   * 
   * @param mouseEvent mouse event to get the coordinates from
   */
  private convertToRelative = (mouseEvent: MouseEvent): IPoint => {
      const boundingRect = this.svgElement.getBoundingClientRect();

      return {
          x: mouseEvent.clientX - boundingRect.left,
          y: mouseEvent.clientY - boundingRect.top,
      };
  }
}

export default TakeoffFloorPlan;
