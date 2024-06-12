import { InfoIcon } from "@chakra-ui/icons"
import { Stack, StackProps, Text, useStyleConfig } from "@chakra-ui/react"
import { FC } from "react";

interface IInfoMinimalismGrayBox extends StackProps {
    text: string;
}

export const InfoMinimalismGrayBox: FC<IInfoMinimalismGrayBox> = ({ text, ...rest }) => {
    const style = useStyleConfig('InfoMinimalismGrayBox');

    return (
        <Stack __css={style} direction="row" alignItems="center" {...rest}>
            <InfoIcon fontSize="small"/>
            <Text fontSize="small">{text}</Text>
        </Stack>
    )
}