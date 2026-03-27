import { AnyComponent, AnyContainer } from '../types';
/**
 * Recursively resolves a container and the components contained within them, building a flat list of components.
 *
 * @param container The container to get the contained components from
 */
export declare function resolveAllComponents(container: AnyContainer): AnyComponent[];
