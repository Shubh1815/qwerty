import { useHistory } from 'react-router-dom';
import { useQuery, QueryKey, QueryFunction, UseQueryOptions } from 'react-query';

import useToken from './useToken';
import { ErrorReponse } from '../api/';


function useAuthQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
>(
    id: TQueryKey,
    fn: QueryFunction<TQueryFnData, TQueryKey>,
    options?: UseQueryOptions<TQueryFnData, ErrorReponse<TError>, TData, TQueryKey>
) {


    const { removeTokens } = useToken();

    const history = useHistory();

    const logout = () => {
        removeTokens();
        history.push('/');
    }

    const updatedOptions: UseQueryOptions<TQueryFnData, ErrorReponse<TError>, TData, TQueryKey> = {
        ...options,
        refetchOnWindowFocus: false,
        onError: (error) => {
            if (error.status === 401 || error.status === 403) {
                logout();
            }
        },
        retry: false,
    }

    return useQuery<TQueryFnData, ErrorReponse<TError>, TData, TQueryKey>(id, fn, updatedOptions);
};

export default useAuthQuery;