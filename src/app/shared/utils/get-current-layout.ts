import { FullWidthLayout, MobileLayout } from "../../Layouts/layout-types";

export const getCurrentLayout = () => {
    const mobileBreakpoint = 768;

    if (window.innerWidth <= mobileBreakpoint) {
        return MobileLayout;
    } else {
        return FullWidthLayout;
    }
}