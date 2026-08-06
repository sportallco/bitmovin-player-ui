/**
 * The message bridge that the Bitmovin Android and iOS SDKs inject into the WebView the UI runs in. It is not
 * available when the UI runs in a regular browser page.
 */
export interface CustomMessageHandler {
  sendAsynchronous(name: string, data?: string): void;
}

/**
 * Returns the custom message handler of the hosting mobile SDK, or `undefined` when the UI does not run inside a
 * mobile SDK WebView. Its presence is the only reliable way to tell a mobile SDK WebView apart from a browser page,
 * because mobile browsers and tablets are indistinguishable from it by user agent alone.
 */
export function getCustomMessageHandler(): CustomMessageHandler | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return (window as unknown as { bitmovin?: { customMessageHandler?: CustomMessageHandler } }).bitmovin
    ?.customMessageHandler;
}
