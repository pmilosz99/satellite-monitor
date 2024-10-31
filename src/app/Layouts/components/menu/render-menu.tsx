import { Flex, Spacer } from "@chakra-ui/react";
import { MENU_ITEMS } from "./menu-items";
import { MenuLink } from "../menu-link";
import { TitleSection } from "./title-section";

export const renderMenu = () => {
    return MENU_ITEMS.map((section, index) => (
        <>
            { section.isAlignBottom ? <Spacer /> : null }
            <TitleSection key={`${section.title}-${index}`} Icon={section.icon} title={section.title} route={section.route} />
            {
                section.children ? (
                    <Flex pl={7} flexDir="column">
                        {
                            section.children.map((sectionItem, index, array) => (
                                <MenuLink key={`${sectionItem.title}-${index}`} to={sectionItem.route} mb={index === array.length - 1 ? 5 : 0}>
                                    {sectionItem.title}
                                </MenuLink>
                            ))
                        }
                    </Flex>
                ) : null
            }
        </>
    ))
};