import type { UIComponentConfigOverrides } from '../UIComponentConfigOverrides';
import type { ComponentConfig } from '../components/Component';
/**
 * Provides {@link UIComponentConfigOverrides} overrides while a UI variant is being constructed.
 *
 * Component applies these overrides to the constructor config object before subclass constructors continue. Passing
 * this state through every component constructor would change the UIFactory and component APIs, so UIManager opens this
 * short-lived context around lazy UI construction instead.
 *
 * The context is intentionally synchronous: it is set before the variant factory runs and cleared immediately after.
 * Outside that construction window, components receive no UIConfig component override.
 */
export declare class ComponentConfigManager {
    private static componentConfig;
    private static variantIdentifier;
    /**
     * Runs a UI variant factory with component overrides enabled for the given variant.
     */
    static run<T>(config: UIComponentConfigOverrides, variant: string, build: () => T): T;
    /**
     * Returns the override config for a component constructor.
     *
     * Base class config is applied first, then specific component config. Variant-scoped config is applied after
     * top-level config, so variant entries win.
     */
    static getConfigFor(componentConstructor: {
        prototype: object;
    }): Partial<ComponentConfig>;
    private static applyConfig;
}
