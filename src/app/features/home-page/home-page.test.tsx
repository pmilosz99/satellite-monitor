import { render, screen, cleanup } from "@testing-library/react";
import { expect } from "vitest";
import { HomePage } from "./home-page";
import { ChakraProvider } from "@chakra-ui/react";
import { dict, LANGUAGE_VALUES } from "../../shared/dict-translation";

describe("HomePage Component", () => {
  beforeEach(() => {
    render(
      <ChakraProvider>
        <HomePage />
      </ChakraProvider>
    );
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the title and description text correctly", () => {
    const title = screen.getByText(dict[LANGUAGE_VALUES.EN]["homePageWelcome"]);
    expect(title).toBeInTheDocument();

    const descriptionText = dict[LANGUAGE_VALUES.EN]["homePageDisc"];
    const description = screen.getByText(new RegExp(descriptionText.replace(/\s+/g, "\\s*")))
    expect(description).toBeInTheDocument();
  });
});