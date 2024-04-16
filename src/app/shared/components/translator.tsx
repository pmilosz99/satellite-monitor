import { useAtomValue } from "jotai"
import { language } from "../atoms";
import { FC } from "react";
import { dict } from "../dict-translation";

interface ITranslator {
    dictKey: string;
}

export const T: FC<ITranslator> = ({ dictKey }): string => {
    const lng = useAtomValue(language);

    return dict[lng][dictKey] || 'error translation';
};
