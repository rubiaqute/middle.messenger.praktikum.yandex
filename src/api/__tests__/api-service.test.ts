import { FetchOptions, HTTPTransport, METHODS } from "../api-service.ts";
import { expect, use } from 'chai'
import * as sinonChai from 'sinon-chai'
import { createSandbox, SinonStub } from 'sinon'

describe("HTTPTransport", () => {
    use(sinonChai.default)
    let api: HTTPTransport
    let request: SinonStub
    const sandBox = createSandbox()
    const testUrl = 'test-url'
    type TestCase = {
        apiMethodName: keyof HTTPTransport,
        methodName: METHODS
    }

    beforeEach(() => {
        api = new HTTPTransport();
        request = sandBox.stub(api, 'request').callsFake(() => Promise.resolve())
    });
    afterEach(() => sandBox.restore())

    const testCases: TestCase[] = [
        {
            apiMethodName: 'get',
            methodName: METHODS.GET
        },
        {
            apiMethodName: 'delete',
            methodName: METHODS.DELETE
        },
        {
            apiMethodName: 'post',
            methodName: METHODS.POST
        },
        {
            apiMethodName: 'put',
            methodName: METHODS.PUT
        }
    ]

    testCases.forEach((item) => {
        it(`Makes ${item.apiMethodName} request with method ${item.methodName}`, async () => {
            await api[item.apiMethodName](testUrl)

            expect(request).calledWith(testUrl, { method: item.methodName })
        })
    })

    it('Transmits options to request', async () => {
        const testOptions: FetchOptions = {
            headers: {
                header1: 'test=header'
            },
            timeout: 100,
            data: {
                data1: 'data'
            },
            contentType: 'test'
        }

        await api.get(testUrl, testOptions)

        expect(request).calledWith(testUrl, { ...testOptions, method: METHODS.GET }, testOptions.timeout)
    })

})
