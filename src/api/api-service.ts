enum METHODS {
    GET = 'GET',
    PUT = 'PUT',
    POST = 'POST',
    DELETE = 'DELETE'
};

export type FetchData = Record<string, unknown>

type FetchOptions = {
    method?: METHODS,
    data?: FetchData | FormData,
    headers?: Record<string, string>
    timeout?: number
    contentType?: string
}

type FetchMethod = (url: string, options?: FetchOptions, timeout?: number) => Promise<unknown>

function queryStringify(data: FetchData) {
    if (typeof data !== 'object') {
        throw new Error('Data must be object');
    }

    const keys = Object.keys(data);

    return keys.reduce((result, key, index) => {
        return `${result}${key}=${data[key]}${index < keys.length - 1 ? '&' : ''}`;
    }, '?');
}

export const BASE_URL = 'https://ya-praktikum.tech/api/v2'

export class HTTPTransport {
    get: FetchMethod = (url, options = {}) => {
        return this.request(url, { ...options, method: METHODS.GET }, options.timeout)
    }

    post: FetchMethod = (url, options = {}) => {
        return this.request(url, { ...options, method: METHODS.POST }, options.timeout);
    };

    put: FetchMethod = (url, options = {}) => {
        return this.request(url, { ...options, method: METHODS.PUT }, options.timeout);
    };

    delete: FetchMethod = (url, options = {}) => {
        return this.request(url, { ...options, method: METHODS.DELETE }, options.timeout);
    };

    request: FetchMethod = (url, options = {}, timeout = 5000) => {
        const { headers = {}, method, data } = options;

        return new Promise(function (resolve, reject) {
            if (!method) {
                reject('No method');
                return;
            }

            const xhr = new XMLHttpRequest();

            xhr.open(
                method,
                method === METHODS.GET && Boolean(data)
                    ? `${BASE_URL}${url}${queryStringify(data as FetchData ?? {})}`
                    : `${BASE_URL}${url}`,
            );
            if (data instanceof FormData) {
                xhr.setRequestHeader('Accept', 'application/json');
            } else {
                xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            }

            xhr.withCredentials = true;
            xhr.responseType = 'json';

            Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value))

            xhr.onload = function () {
                if (xhr.status !== 200) {
                    reject(xhr);
                } else {
                    resolve(xhr);
                }
            };

            xhr.onabort = reject;
            xhr.onerror = reject;

            xhr.timeout = timeout;
            xhr.ontimeout = reject;

            if (method === METHODS.GET || !data) {
                xhr.send();
            } else {
                xhr.send(data instanceof FormData ? data : JSON.stringify(data));
            }


        });
    };
}
