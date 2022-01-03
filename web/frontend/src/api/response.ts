export interface SuccessResponse<TData = unknown> {
    status: string,
    data: TData,
}

export interface ErrorReponse<TResponse = unknown> {
    status: number,
    response: TResponse,
};


