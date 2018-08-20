import { composeTakeOffPath } from '../util/AppRoutes';

/**
 * Service class.
 * Mainly encapsulaets API calls.
 */
export class Service {
    /**
     * Calls API to create a TakeOff.
     * 
     * @param fileName name of the file to upload
     * @param content content of the file to process
     * @param onSuccess function to call on success
     * @param onError function to call on error
     */
    public createTakeoff(
        fileName: string, 
        content: string,
        onSuccess: Function,
        onError: Function
    ): void {
        const data: IUploadFilePayload = {filename: fileName, content: content};
        this.callApi<IUploadFilePayload, IUploadFileResponseJson>(
            '/upload_file',
            'POST',
            data,
            onSuccess,
            onError);        
    }

    /**
     * Calls API to clean up the database.
     * 
     * @param onSuccess function to call on success
     * @param onError function to call on error
     */
    public cleanUpDatabase(
        onSuccess: Function,
        onError: Function
    ): void {
        const data: IUtilPayload = {action: 'drop_database'};
        this.callApi<IUtilPayload, IUtilResponseJson>(
            '/util',
            'POST',
            data,
            onSuccess,
            onError);        
    }

    /**
     * Calls API to get Takeoff status.
     * 
     * @param takeoffId function to call on success
     * @param onSuccess function to call on success
     * @param onError function to call on error
     */
    public getTakeoffStatus(
        takeoffId: string,
        onSuccess: Function,
        onError: Function
    ): void {
        const endpoint: string = composeTakeOffPath('/status/:takeoffId', takeoffId);
        this.callApi<{}, [ITakeoffStatusStepResponseJson]>(
            endpoint,
            'GET',
            null,
            onSuccess,
            onError);        
    }

    /**
     * Calls API to get Takeoff floor plans.
     * 
     * @param takeoffId function to call on success
     * @param onSuccess function to call on success
     * @param onError function to call on error
     */
    public getTakeoffFloorPlans(
        takeoffId: string,
        onSuccess: Function,
        onError: Function
    ): void {
        const endpoint: string = composeTakeOffPath('/status/:takeoffId/floor_plans', takeoffId);
        this.callApi<{}, [ITakeoffFloorPlanResponseJson]>(
            endpoint,
            'GET',
            null,
            onSuccess,
            onError);        
    }

    /**
     * Calls a specified API endpoint.
     * 
     * @param endpoint API endpoint to call
     * @param method HTTP method to use (GET, POST, PUT, DELETE)
     * @param data payload object
     * @param onSuccess function to call on success
     * @param onError function to call on error
     */
    private callApi<TPayload, TResult>(
        endpoint: string,
        method: string,
        data: TPayload | null,
        onSuccess: Function,
        onError: Function
    ): void {
        const url: string = `${this.getApiHost()}${endpoint}`;
        try {
            fetch(
                url,
                {
                    method: method,
                    mode: 'cors',
                    body: (data === null ? null : JSON.stringify(data)),
                    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
                }
            )
            .then(async (response) =>  { 
                // fetch() resolves promise successfully even if responce.ok is false
                // API retuns JSON with error description when HTTP status is 400
                // Otherwise treat the call as failed with nothing but HTTP status known
                if (response.ok || response.status === 400) {
                    return response.json();
                  } else {
                    return {_error: `Request rejected with status ${response.status}`};
                  }
                }
            )
            .catch((error: Error) => { onError(error); })
            .then((response: TResult | FetchError) => { 
                if (response) {
                    // tslint:disable
                    if ('_error' in (response as any)) {
                    onError(new Error((response as FetchError)._error));
                    } else {
                        onSuccess(response as TResult); 
                    }
                    // tslint:enable
                }
            })
            .catch((error: Error) => { onError(error); });
        } catch (error) {
            onError(error);
        }
    }

    /**
     * Returns API host to add to the endpoint names.
     */
    private getApiHost(): string {
        return process.env.REACT_APP_API_HOST!;
    }
}

/**
 * Type with fetch() error information.
 */
export type FetchError = {
    _error: string;
};

/**
 * Interface for /upload_file endpoint JSON response.
 */
export interface IUploadFileResponseJson {
    takeoff_id: string;
}

/**
 * Interface for /upload_file endpoint JSON payload.
 */
interface IUploadFilePayload {
    filename: string;
    content: string;
}

/**
 * Interface for /util endpoint JSON response.
 */
export interface IUtilResponseJson {
    success: boolean;
    error: string;
}

/**
 * Interface for /util endpoint JSON payload.
 */
interface IUtilPayload {
    action: string;
}

/**
 * Interface for the /status/:takeoff_id end point JSON response ARRAY ELEMENT.
 */
export interface ITakeoffStatusStepResponseJson {
    step_name: string;
    loading: boolean;
    loaded: boolean;
    message: boolean;
}

/**
 * Interface for the /status/:takeoff_id/floor_plan end point JSON response ARRAY ELEMENT.
 */
export interface ITakeoffFloorPlanResponseJson {
    page_number: number;
    page_data: string;
    bboxes: [[number]];
}
