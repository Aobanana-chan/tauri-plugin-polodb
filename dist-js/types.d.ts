export type ResultSuccess<T> = {
    success: true;
    data: T;
};
export type ResultFailure = {
    success: false;
    error: string;
    context?: any;
};
export type Result<T> = ResultSuccess<T> | ResultFailure;
export declare function isSuccess<T>(result: Result<T>): result is ResultSuccess<T>;
export declare function isError(result: Result<any>): result is ResultFailure;
