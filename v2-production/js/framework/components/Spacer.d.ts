import { Component, ComponentConfig } from './Component';
/**
 * A dummy component that just reserves some space and does nothing else.
 *
 * @category Components
 */
export declare class Spacer extends Component<ComponentConfig> {
    constructor(config?: ComponentConfig);
    protected onShowEvent(): void;
    protected onHideEvent(): void;
    protected onHoverChangedEvent(hovered: boolean): void;
}
