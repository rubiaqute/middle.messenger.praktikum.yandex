import { expect } from 'chai'
import { Router } from '../router'
import { Block } from '../../components/common/block';

describe("Router", () => {
    let router: Router
    const testPath = '/test'

    beforeEach(() => {
        router = new Router('app');
        router.use(testPath, Block).start()
    });

    it('Add route to paths list', async () => {
        expect(router.routes[0]).to.include({ _pathname: testPath })
    })

    it('Goes to selected route', async () => {
        router.go(testPath)

        expect(window.location.pathname).to.eq(testPath)
    })

    it('Writes history on router step', async () => {
        const initialHistoryLength = window.history.length
        router.go(testPath)

        expect(window.history.length - initialHistoryLength).to.eq(1)
    })

    it('Returns correct current path', async () => {
        router.go(testPath)

        expect(router.currentPath).to.eq(testPath)
    })
})
