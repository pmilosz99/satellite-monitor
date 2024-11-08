import { ChakraProvider } from "@chakra-ui/react";
import SettingsModuleItem from "./settings-module-item";
import { render, screen } from "@testing-library/react";

describe('SettingsModuleItem component', () => {
    it('render the component', () => {
        render(
            <ChakraProvider>
                <SettingsModuleItem text="Example text value" />
            </ChakraProvider>
        )

        const text = screen.getByText('Example text value');
        expect(text).toBeInTheDocument();
    })
});