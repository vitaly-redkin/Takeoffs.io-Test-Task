/**
 * The Takeoff Tiled Area component.
 */
import * as React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import * as lodash from 'lodash';

import { addBase64ImagePrefix, stripBase64ImagePrefix, getImageSize } from '../../util/Util';
import { ITakeoffTiledAreaResponseJson, Service } from '../../util/Service';
import { BaseProcessor, IBaseProcessorState } from '../base-processor/BaseProcessor';
import SvgRect, { SvgRectData } from '../svg-rect/SvgRect';
import { ISize, IPoint } from '../../util/CommonTypes';

import './TakeoffTiledArea.css';

// Component props
interface ITakeoffTiledAreaProps {
  takeoffId: string;
  area: ITakeoffTiledAreaResponseJson;
}

/**
 * Enumeration with tiled mas ediiting modes.
 */
enum TiledMaskModeEnum {
  Add,
  Subtract
}

// Component state
interface ITakeoffTiledAreaState extends IBaseProcessorState {
  scale: number;
  svgWidth: string;
  svgHeight: string;
  tiledMask: string;
  isInDrawing: boolean;
  mode: TiledMaskModeEnum;
  currentRect: IPoint[];
}

class TakeoffTiledArea extends BaseProcessor<ITakeoffTiledAreaProps, ITakeoffTiledAreaState> {
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

    this.setState({tiledMask: this.props.area.tiled_mask});

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
          <h6>Floor Plan {this.props.area.floor_plan_number}</h6>
        </CardHeader>
        <CardBody className='p-2'>
          {this.renderTiledArea()}
        </CardBody>
      </Card>
    );
  }

  /**
   * Renders floor plan.
   */
  private renderTiledArea(): JSX.Element | null {
    if (!this.state) {
      return null;
    }

    return (
      <div ref={this.setContainerDivRef} className='w-100 text-center'>
        <svg className='takeoff-tiled-area-svg'
             style={{width: this.state.svgWidth, height: this.state.svgHeight}}
             ref={this.setSvgRef}
             onMouseDown={this.onMouseDown} onMouseMove={this.onMouseMove}>
             >
          <image xlinkHref={addBase64ImagePrefix(this.props.area.plan)}
                 style={{width: this.state.svgWidth, height: this.state.svgHeight}}
          />
          <image xlinkHref={addBase64ImagePrefix(this.state.tiledMask)}
                 style={{width: this.state.svgWidth, height: this.state.svgHeight, opacity: 0.2}}
          />

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
    const color: string = (this.state.mode === TiledMaskModeEnum.Add ? 'black' : 'white');
    const opacity: number = (this.state.mode === TiledMaskModeEnum.Add ? 0.2 : 0.5);

    const rect: SvgRectData = {
      rectId: -1,
      x: x,
      y: y,
      w: w,
      h: h,
      color: color,
      noStroke: true,
      opacity: opacity,
      cursor: 'default',
      onDeleteHandler: null
    };

    return (
      <SvgRect {...rect} />
    );
  }

  /**
   * Calls service to update tiled are mask after change.
   */
  private updateTiledAreaMask = () => {
    this.setOperationName('Saving tiled area');

    new Service().setTakeoffTiledAreaMask(
      this.props.takeoffId,
      this.props.area.floor_plan_number,
      this.state.tiledMask,
      () => null,
      this.onServiceCallFailed
    );
  }

  /**
   * Handler of the Resize event.
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
    const imageSize = await getImageSize(this.props.area.plan);

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
   * Returns tiled mask editing mode.
   * 
   * @param mouseEvent Event details to analyze
   */
  private getTiledMaskMode = (mouseEvent: MouseEvent): TiledMaskModeEnum => {
    return (mouseEvent.altKey ? TiledMaskModeEnum.Subtract : TiledMaskModeEnum.Add);
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
      const mode: TiledMaskModeEnum = this.getTiledMaskMode(mouseEvent);
          
      this.setState((prevState: ITakeoffTiledAreaState) => {
        return {
          ...prevState, 
          isInDrawing: true, 
          mode: mode,
          currentRect: [point]};
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
      const mode: TiledMaskModeEnum = this.getTiledMaskMode(mouseEvent);

      this.setState((prevState: ITakeoffTiledAreaState) => {
        return {
          ...prevState, 
          isInDrawing: true, 
          mode: mode,
          currentRect: prevState.currentRect.slice(0, 1).concat(point)};
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
  private onMouseUp = async (mouseEvent: MouseEvent) => {
    if (mouseEvent.button !== 0) {
        return;
    }
    let maskUpdated = false;
    if (this.state.isInDrawing &&
        (this.state.currentRect.length === 2)) {
      const mode: TiledMaskModeEnum = this.getTiledMaskMode(mouseEvent);
      const scale: number = this.state.scale;
      const r: IPoint[] = this.state.currentRect;
      const x: number = Math.round(Math.min(r[0].x, r[1].x) / scale);
      const y: number = Math.round(Math.min(r[0].y, r[1].y) / scale);
      const w: number = Math.round(Math.abs(r[0].x - r[1].x) / scale);
      const h: number = Math.round(Math.abs(r[0].y - r[1].y) / scale);

      // Check if new rectangle is large enough
      if (w > 2 && h > 2) {
        maskUpdated = true;

        const maskPatchRectangle: number[] = [x, y, w, h];
        await this.patchTiledMask(
          this.state.tiledMask, maskPatchRectangle, mode);
      }
    }

    if (!maskUpdated) {
      this.setState((prevState: ITakeoffTiledAreaState) => {
        return {
          ...prevState, 
          isInDrawing: false, 
          currentRect: []};
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

  /**
   * Adds or substracts rectangle from the mask.
   * 
   * @param tiledMask tiled mask to update
   * @param rect rectangle to add or update ([x, y, w, h])
   * @param mode patch mode (add or subtract)
   */
  private patchTiledMask = async (
    tiledMask: string, 
    rect: number[], 
    mode: TiledMaskModeEnum) => {

    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
    const url = addBase64ImagePrefix(tiledMask);
    const img = new Image();
    img.src = url;
    img.onload = () => {    
      const w: number = img.width;
      const h: number = img.height;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h, 0, 0, w, h);
      const color: string = (mode === TiledMaskModeEnum.Add ? 'black' : 'white');
      ctx.fillStyle = color;
      ctx.fillRect(rect[0], rect[1], rect[2], rect[3]);
      
      const newTiledMask: string = stripBase64ImagePrefix(canvas.toDataURL());

      this.setState(
        (prevState: ITakeoffTiledAreaState) => {
          return {
            ...prevState, 
            tiledMask: newTiledMask,
            isInDrawing: false, 
            currentRect: []};
        },
        () => {
          this.updateTiledAreaMask();
        }
      );
    };
  }
}

export default TakeoffTiledArea;
