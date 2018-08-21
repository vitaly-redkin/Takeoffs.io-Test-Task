/**
 * SVG Rectangle component.
 */
import * as React from 'react';

/**
 * SVG rectangle data type.
 */
export type SvgRectData = {
  rectId: number;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  noStroke: boolean;
  opacity: number;
  cursor: string;
  onDeleteHandler: Function | null;
};

class SvgRect extends React.PureComponent<SvgRectData> {
  public render(): JSX.Element | null {
    const x = this.props.x;
    const y = this.props.y;
    const w = this.props.w;
    const h = this.props.h;
    const strokeWidth: number = (this.props.noStroke ? 0 : 1);

    return (
      <g>
        <rect x={x}
              y={y}
              width={w}
              height={h}
              stroke='black' 
              fill={this.props.color} 
              strokeWidth={strokeWidth}
              fillOpacity={this.props.opacity}
              style={{ cursor: this.props.cursor }} />
        {this.renderDelete(x, y, w)}
      </g>
    );
  }

  /**
   * Renders delete markup (if callback provided)
   * 
   * @param x rectangle left coordinate
   * @param y rectangle top coordinate
   * @param w rectangle width
   */
  private renderDelete = (x: number, y: number, w: number): JSX.Element | null => {
    if (!this.props.onDeleteHandler) {
      return null;
    }

    const closeRadius: number = 6;
    const closeCenterX: number = x + w - closeRadius / 2;
    const closeCenterY: number = y + closeRadius / 2;
    const k: number = Math.cos(180 / 45);
    const x1 = closeCenterX - closeRadius * k;
    const y1 = closeCenterY + closeRadius * k;
    const x2 = closeCenterX + closeRadius * k;
    const y2 = closeCenterY - closeRadius * k;

    return (
      <React.Fragment>
        <circle cx={closeCenterX}
                cy={closeCenterY}
                r={closeRadius}
                fill='white'
                stroke='black'
                strokeWidth='1'
                cursor='pointer'
                onClick={this.deleteRect}>
          <title>Click to delete this one</title>
        </circle>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke='black' />
        <line x1={x1} y1={y2} x2={x2} y2={y1} stroke='black' />
      </React.Fragment>
    );
  }

  /**
   * Clicks a call back provided by the parent component to delete the rectangle.
   */
  private deleteRect = (): void => {
    if (this.props.onDeleteHandler) {
      this.props.onDeleteHandler(this.props.rectId);
    }
  }
}

export default SvgRect;
