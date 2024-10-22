import { HTTPTransport } from "./api-service";
import { BaseAPI } from "./base-api";

const resourcesApiInstance = new HTTPTransport();

const urlBase = '/resources'

export class ResourcesApi extends BaseAPI {
    getResource(path: string) {
        return resourcesApiInstance.get(`${urlBase}/${path}`);
    }
}
