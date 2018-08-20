/**
 * Common application types and interfaces.
 */
import { RouteComponentProps } from 'react-router-dom';

/**
 *  Interface for component URL params
 */ 
interface ITakeoffUrlParams {
    takeoffId: string;
}

/**
 * Properties type for the components with takeoff_id in the path.
 */
export type TakeoffRouteProps = RouteComponentProps<ITakeoffUrlParams>;

/**
 * Required to make the component "withRouter-enabled".
 */
interface IDummyProps {
}

/**
 * Component props type with router properties.
 */
export type RouteComponentDummyProps = RouteComponentProps<IDummyProps>;

/**
 * Image size.
 */
export interface ImageSize {
    width: number;
    height: number;
}
