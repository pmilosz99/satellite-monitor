import { IconButton, useColorMode } from "@chakra-ui/react";
import { useSetAtom } from "jotai";
import { currentTheme } from "../../../shared/atoms";
import { THEME_TYPE } from "../../../shared/themes";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export const ThemeChanger = () => {
    const {colorMode, toggleColorMode } = useColorMode();
    const setTheme = useSetAtom(currentTheme);
    
    const handleClik = () => {
        toggleColorMode();
        setTheme(colorMode === THEME_TYPE.DARK ? THEME_TYPE.LIGHT : THEME_TYPE.DARK);
        /**
         * We have to use both solutions (useColorMode and atom value) 
         * because useColorMode dont working 
         * (is undefined in App component)
         */
    }

    return (
        <IconButton 
                variant='outline'
                aria-label="theme-changer"
                onClick={handleClik}
                icon={colorMode === THEME_TYPE.DARK ? <SunIcon /> : <MoonIcon />}
            />
    )
}