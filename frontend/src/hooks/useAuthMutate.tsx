import { useMutation, MutateFunction, UseMutationOptions } from 'react-query';

import { ErrorReponse } from '../api/';
import useAuth from './useAuth';

function useAuthMutation<
    TData = unknown,
    TError = unknown,
    TVariables = unknown,
    TContext = unknown
>(
    fn: MutateFunction<TData, ErrorReponse<TError>, TVariables, TContext>,
    options?: UseMutationOptions<TData, ErrorReponse<TError>, TVariables, TContext>
) {
    const { logOut } = useAuth();

    const updatedOptions: UseMutationOptions<TData, ErrorReponse<TError>, TVariables, TContext> = {
        ...options,
        retry: false,
        onError: (error) => {
            if (error.status === 401 || error.status === 403) {
                logOut();
            }
        }
    }

    return useMutation<TData, ErrorReponse<TError>, TVariables, TContext>(fn, updatedOptions);
};

export default useAuthMutation;