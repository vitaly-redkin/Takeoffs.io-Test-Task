export class Service {
    public createTakeoff(
        fileName: string, 
        file: File,
        onSuccess: Function,
        onError: Function
    ): void {
        const data: IUploadFilePayload = {filename: fileName, content: file.name};
        this.makeRequest<IUploadFilePayload, IUploadFileResponseJson>(
            '/upload_file',
            'POST',
            data,
            onSuccess,
            onError);        
    }

    private makeRequest<TPayload, TResult>(
        endpoint: string,
        method: string,
        data: TPayload,
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
                    body: JSON.stringify(data),
                    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
                }
            )
            .then(async (response) => response.json())
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
            debugger; 
            onError(error);
        }
    }

    private getApiHost(): string {
        return 'http://localhost:5000';
    }
}

export type FetchError = {
    _error: string;
};

export interface IUploadFileResponseJson {
    takeoff_id: string;
}

interface IUploadFilePayload {
    filename: string;
    content: string;
}
