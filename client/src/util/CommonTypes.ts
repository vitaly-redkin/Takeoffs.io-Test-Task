import { RouteComponentProps } from 'react-router-dom';

// Interface for component URL params
interface ITakeoffUrlParams {
    takeoffId: string;
}
  
export type TakeoffRouteProps = RouteComponentProps<ITakeoffUrlParams>;

// Required to make the component "withRouter-enabled".
interface IDummyProps {
}

export type RouteComponentDummyProps = RouteComponentProps<IDummyProps>;
