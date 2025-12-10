import { render, screen } from "@testing-library/react-native";
import React from "react";
import { ThemedText } from "../../components/ThemedText";

jest.mock("../../theme/theme", () => ({
  theme: {
    typography: {
      body: {
        fontFamily: "PlusJakartaSans",
        fontSize: 14,
        lineHeight: 20,
        fontWeight: "400",
      },
      h1: {
        fontFamily: "Inter",
        fontSize: 26,
        lineHeight: 32,
        fontWeight: "700",
      },
      bodySmall: {
        fontFamily: "PlusJakartaSans",
        fontSize: 12,
        lineHeight: 16,
        fontWeight: "400",
      },
    },
  },
}));

describe("ThemedText", () => {
  test("renders children correctly", () => {
    render(<ThemedText>Test Text</ThemedText>);
    expect(screen.getByText("Test Text")).toBeOnTheScreen();
  });

  test("applies default body variant when no variant is specified", () => {
    render(<ThemedText testID="themed-text">Test Text</ThemedText>);
    const textElement = screen.getByTestId("themed-text");
    expect(textElement.props.style).toEqual(
      expect.objectContaining({
        fontFamily: "PlusJakartaSans",
        fontSize: 14,
        lineHeight: 20,
        fontWeight: "400",
      })
    );
  });

  test("applies correct typography style for h1 variant", () => {
    render(
      <ThemedText variant="h1" testID="heading-text">
        Heading Text
      </ThemedText>
    );
    const textElement = screen.getByTestId("heading-text");
    expect(textElement.props.style).toEqual(
      expect.objectContaining({
        fontSize: 26,
        lineHeight: 32,
        fontWeight: "700",
        fontFamily: "Inter",
      })
    );
  });

  test("applies custom color when color prop is provided", () => {
    render(
      <ThemedText color="#ff0000" testID="red-text">
        Red Text
      </ThemedText>
    );
    const textElement = screen.getByTestId("red-text");
    expect(textElement.props.style).toEqual(
      expect.objectContaining({
        color: "#ff0000",
      })
    );
  });

  test("merges custom style with theme typography", () => {
    const customStyle = { marginTop: 10, fontSize: 20 };
    render(
      <ThemedText style={customStyle} testID="styled-text">
        Styled Text
      </ThemedText>
    );
    const textElement = screen.getByTestId("styled-text");
    expect(textElement.props.style).toEqual(
      expect.objectContaining({
        marginTop: 10,
        fontSize: 20,
        fontWeight: "400",
        fontFamily: "PlusJakartaSans", // custom style values should be applied while retaining other theme styles
      })
    );
  });

  test("passes through additional TextProps", () => {
    render(
      <ThemedText testID="themed-text" numberOfLines={2}>
        Test Text
      </ThemedText>
    );
    const textElement = screen.getByTestId("themed-text");
    expect(textElement.props.testID).toBe("themed-text");
    expect(textElement.props.numberOfLines).toBe(2);
  });

  test("handles combination of variant, color, and custom style", () => {
    const customStyle = { textAlign: "center" as const };
    render(
      <ThemedText variant="bodySmall" color="#0000ff" style={customStyle} testID="complex-text">
        Complex Text
      </ThemedText>
    );
    const textElement = screen.getByTestId("complex-text");
    expect(textElement.props.style).toEqual(
      expect.objectContaining({
        fontSize: 12, // from bodySmall variant
        lineHeight: 16, // from bodySmall variant
        color: "#0000ff", // custom color override
        textAlign: "center", // custom style
      })
    );
  });

  test("does not apply color when color prop is not provided", () => {
    render(<ThemedText testID="default-text">Default Color Text</ThemedText>);
    const textElement = screen.getByTestId("default-text");
    // should use only theme styles, no custom color applied
    expect(textElement.props.style).not.toHaveProperty("color");
  });
});
