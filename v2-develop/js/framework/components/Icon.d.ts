import { Component, ComponentConfig } from './Component';
import { DOM } from '../DOM';
export declare class Icon extends Component<ComponentConfig> {
    constructor(config?: ComponentConfig);
    protected toDomElement(): DOM;
}
