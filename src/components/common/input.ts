import { BasicBlockProps, Block, Events } from "./block";

export abstract class Input<Props extends BasicBlockProps> extends Block<Props> {
    override addSpecificEvents() {
        const events = (this.props.events ?? {}) as Events;
        Object.keys(events).forEach((eventName) => {
            Array.from(
                this.element?.getElementsByTagName("input") ?? [],
            )[0].addEventListener(
                eventName,
                events[eventName] as EventListenerOrEventListenerObject,
            );
        });
    }

    override removeSpecificEvents(): void {
        const events = (this.props.events ?? {}) as Events;
        Object.keys(events).forEach((eventName) => {
            Array.from(
                this.element?.getElementsByTagName("input") ?? [],
            )[0]?.removeEventListener(
                eventName,
                events[eventName] as EventListenerOrEventListenerObject,
            );
        });
    }

}
