import { Text, TextProps, useStyleConfig } from '@chakra-ui/react';
import { FC } from 'react';

interface IModuleItem extends TextProps {
    text: string;
}

export const SettingsModuleItem: FC<IModuleItem> = ({ text, ...rest }) => {
    const styles = useStyleConfig('SettingsModuleItem');

    return (
        <Text sx={styles} as="b" p={1} fontSize="medium" {...rest}>{text}</Text>
    )
};

export default SettingsModuleItem;