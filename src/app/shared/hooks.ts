import { useAtomValue } from "jotai"
import { map } from "./atoms";

export const useMap = () => {
    const globalMap = useAtomValue(map);

    return globalMap;
};

export default useMap;