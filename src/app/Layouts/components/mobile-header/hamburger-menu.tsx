import { MENU_ITEMS } from "../menu/menu-items";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Box, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerOverlay, IconButton, useDisclosure, VStack } from "@chakra-ui/react";
import { TitleSection } from "../menu/title-section";
import { MenuLink } from "../menu-link";

export const HamburgerMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
        <IconButton
            icon={<HamburgerIcon />}
            onClick={onOpen}
            variant='outline'
            aria-label="Open Menu"
            color="white"
        />
      <Drawer isOpen={isOpen} placement="top" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="gray.700" color="white">
          <DrawerCloseButton />
          <DrawerBody p='45px 0 30px 0'>
            <VStack spacing={0}>
              {
                MENU_ITEMS.map((section, index) => (
                  <>
                    <TitleSection key={`${section.route}-${index}`} Icon={section.icon} title={section.title} route={section.route} onClick={onClose} underline={index !== 0} />
                    <Divider mb={2} mt={2} />
                    {
                      section.children ? (
                        section.children.map((sectionItem, index, array) => (
                          <>
                            <MenuLink key={`${sectionItem.route}-${index}`} to={sectionItem.route} mb={index === array.length - 1 ? 3 : 0} borderBottom="solid 1px" onClick={onClose}>
                              {sectionItem.title}
                            </MenuLink>
                            {index === array.length - 1 ? <Divider mb={1} /> : null}
                          </>
                        ))
                      ) : (null)
                    }
                  </>
                ))
              }
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};