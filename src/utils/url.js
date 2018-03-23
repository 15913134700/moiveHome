import { stringify } from 'querystring';
import { parse } from 'url';
import { isEmpty } from 'lodash';

export function buildKey(url, params) {

	const urlObject = parse(url, true);
	let urlPath = getUrlPath(url)
	const urlQueryParams = { ...urlObject.query, ...params };
	if (!isEmpty(urlQueryParams)) {

		const sortedParams = Object.keys(urlQueryParams).sort().reduce((result, param) => {
			result[param] = urlQueryParams[param];
			return result;
		}, {});

		urlPath += `?${stringify(sortedParams)}`;
	}

	return urlPath;
}

export function getUrlPath(url) {
    const urlObject = parse(url, true)
    return urlObject.pathname
}