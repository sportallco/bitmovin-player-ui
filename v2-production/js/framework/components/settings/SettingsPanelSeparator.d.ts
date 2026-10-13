import { Container, ContainerConfig } from '../Container';
/**
 * Configuration interface for a {@link SettingsPanelSeparator}.
 *
 * @category Configs
 */
export interface SettingsPanelSeparatorConfig extends ContainerConfig {
}
/**
 * A visual separator between groups of settings panel rows.
 *
 * @category Components
 */
export declare class SettingsPanelSeparator extends Container<SettingsPanelSeparatorConfig> {
    constructor(config?: SettingsPanelSeparatorConfig);
}
