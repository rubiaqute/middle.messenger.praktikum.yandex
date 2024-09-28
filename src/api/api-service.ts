enum METHODS {
    GET = 'GET',
    PUT = 'PUT',
    POST = 'POST',
    DELETE = 'DELETE'
};

type FetchData = Record<string, unknown>

type FetchOptions = {
    method?: METHODS,
    data?: FetchData,
    headers?: Record<string, string>
    timeout?: number
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

export class HTTPTransport {
    get: FetchMethod = (url: string, options = {}) => {
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
                    ? `${url}${queryStringify(data ?? {})}`
                    : url,
            );

            Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value))

            xhr.onload = function () {
                resolve(xhr);
            };

            xhr.onabort = reject;
            xhr.onerror = reject;

            xhr.timeout = timeout;
            xhr.ontimeout = reject;

            if (method === METHODS.GET || !data) {
                xhr.send();
            } else {
                xhr.send(JSON.stringify(data));
            }
        });
    };
}
