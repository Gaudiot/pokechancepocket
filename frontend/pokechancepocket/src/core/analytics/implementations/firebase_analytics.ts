import { Analytics, getAnalytics, logEvent } from "firebase/analytics";
import { getFirebaseApp } from "@/base/firebase/firebase";
import IAnalytics, { AnalyticsEvent } from "../ianalytics";

export default class FirebaseAnalytics implements IAnalytics {
    private analytics: Analytics;

    constructor() {
        this.analytics = getAnalytics(getFirebaseApp());
    }

    trackEvent({name, properties}: AnalyticsEvent): void {
        logEvent(this.analytics, name, properties);
    }
}