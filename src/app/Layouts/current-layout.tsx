import { getCurrentLayout } from "../shared/utils";

export const CurrentLayout = () => {
    const LayoutType = getCurrentLayout();

    return <LayoutType  />
};