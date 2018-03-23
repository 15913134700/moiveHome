import { fetch } from '../utils/http'

export function getCases(params, options){

    return fetch({
        url: '/cases',
        method: 'get',
        params: { page: 1, per_page: 20, ...params },
        cache: true,
        ...options,
    })
}