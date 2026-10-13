import { Component, ComponentConfig } from '../components/Component';
/**
 * @category Utils
 */
export declare namespace UIUtils {
    interface TreeTraversalCallback {
        (component: Component<ComponentConfig>, parent?: Component<ComponentConfig>): void;
    }
    function traverseTree(component: Component<ComponentConfig>, visit: TreeTraversalCallback): void;
    enum KeyCode {
        LeftArrow = 37,
        UpArrow = 38,
        RightArrow = 39,
        DownArrow = 40,
        Space = 32,
        End = 35,
        Home = 36,
        Comma = 188,
        Period = 190
    }
}
