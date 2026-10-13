export declare namespace TimestampLinkUtils {
    function parseTimestampFromUrl(href?: string): number | null;
    function buildTimestampLink(currentTime: number, href?: string): string;
}
