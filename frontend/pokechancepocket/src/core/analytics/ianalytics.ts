export type AnalyticsEvent = {
    name: string;
    properties?: Record<string, any>;
}

export default interface IAnalytics {
    trackEvent(params: AnalyticsEvent): void;
}