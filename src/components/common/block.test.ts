import { expect, use } from 'chai'
import { spy } from 'sinon'
import * as sinonChai from 'sinon-chai'
import { Block } from './block';

type TestProps = {
    testProp: string
}

describe('Block', () => {
    use(sinonChai.default)
    const testProps = { testProp: 'testProp' }
    let component: Block<TestProps>;

    beforeEach(() => {
        component = new Block(testProps);
    })

    it('Transmits props to component props', () => {
        expect(component.props).to.eql(testProps)
    })

    it('Changes props', () => {
        const newProps = { testProp: 'testProp2' }
        component.setProps(newProps)

        expect(component.props).to.eql(newProps)
    })

    it('Rerenders on changing props', () => {
        const spiedRenderMethod = spy(component, 'render')
        component.setProps({ testProp: 'testProp2' })

        expect(spiedRenderMethod.calledOnce).to.eq(true)
    })

    it('Update lists', () => {
        component.updateLists('key', [new Block({}), new Block({})])

        expect(component.lists['key'].length).to.eq(2)
    })

    it('Add specific events on set props', () => {
        const spiedAddSpecificEvents = spy(component, 'addSpecificEvents')
        component.setProps({ testProp: 'testProp2' })

        expect(spiedAddSpecificEvents.calledOnce).to.eq(true)
    })
})
