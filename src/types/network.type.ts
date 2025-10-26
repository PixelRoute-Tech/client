export type ApiResponseType<T> = Promise<{
    success:boolean,
    message:string,
    data:T,
    error:Error
}>