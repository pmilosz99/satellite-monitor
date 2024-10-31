import { Stack, StackProps, Text } from "@chakra-ui/react";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { FC } from "react";
import { MenuLink } from "../menu-link";
import { To } from "react-router-dom";

interface ITitleSection extends StackProps {
    title: string;
    Icon: OverridableComponent<SvgIconTypeMap<object, "svg">> & {
        muiName: string;
    }
    route?: To,
    onClick?: () => void;
    underline?: boolean;
}

export const TitleSection: FC<ITitleSection> = ({ Icon, title, route, onClick, underline, ...rest }) => (
    <Stack direction="row" alignItems="center" {...rest}>
        <Icon fontSize="small"/>
        {
            route ? (
                <Text as='b' mr={5}>
                    <MenuLink to={route} onClick={onClick} borderBottom={underline ? 'solid 1px' : ''}>
                        {title}
                    </MenuLink>
                </Text>
            ) : (
                <Text as='b' mr={5}>
                    {title}
                </Text>
            )
        }
    </Stack>
);