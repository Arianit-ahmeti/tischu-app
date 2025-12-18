export const theme = {
  colors: {
    brand: {
      primary: "#2B1A47",
      secondary: "#B96D7A",
      focus: "#FF5E6C",
      hover: "#FF7380",
    },
    text: {
      dark: "#242424",
      light: "#3C3C43",
      inverted: "#FFF",
      muted: "#8A8A8E",
    },
    background: {
      base: "#FFF",
      warm: "#FFF7F5",
      dark: "#2B1A47",
      light: "#F8F3F2",
    },
    border: {
      light: "#E5E0DE",
      focus: "#FF5E6C",
    },
    success: "#12CD1A",
    warning: "#FFC107",
    error: "#E82117",
    disabled: "#F2F2F2",
    sizeChip: {
      small: "#8D7FA6",
      medium: "#B96D7A",
      large: "#2B1A47",
    },
    characterChip: {
      anxious: "#bd94ffff",
      shy: "#b080ffff",
      relaxed: "#8943FC",
      friendly: "#4D288A",
      aggressive: "#2B1A47",
    },
  },
  typography: {
    fontFamily: {
      inter: "Inter",
      plusJakartaSans: "PlusJakartaSans",
    },

    // Headings - Inter
    h1: {
      fontFamily: "Inter",
      fontSize: 26,
      lineHeight: 32,
      fontWeight: "700" as const,
    },
    h2: {
      fontFamily: "Inter",
      fontSize: 22,
      lineHeight: 28,
      fontWeight: "600" as const,
    },
    h3: {
      fontFamily: "Inter",
      fontSize: 18,
      lineHeight: 24,
      fontWeight: "600" as const,
    },
    h4: {
      fontFamily: "Inter",
      fontSize: 15,
      lineHeight: 20,
      fontWeight: "500" as const,
    },

    // Body text - Plus Jakarta Sans
    bodyLarge: {
      fontFamily: "PlusJakartaSans",
      fontSize: 16,
      lineHeight: 24,
      fontWeight: "400" as const,
    },
    body: {
      fontFamily: "PlusJakartaSans",
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "400" as const,
    },
    bodySmall: {
      fontFamily: "PlusJakartaSans",
      fontSize: 12,
      lineHeight: 16,
      fontWeight: "400" as const,
    },

    // Buttons - Inter
    buttonPrimary: {
      fontFamily: "Inter",
      fontSize: 18,
      lineHeight: 24,
      fontWeight: "600" as const,
    },
    buttonSecondary: {
      fontFamily: "Inter",
      fontSize: 16,
      lineHeight: 22,
      fontWeight: "600" as const,
    },

    // Badge - Inter
    badge: {
      fontFamily: "Inter",
      fontSize: 10,
      lineHeight: 14,
      fontWeight: "700" as const,
      textTransform: "uppercase" as const,
    },

    // Navigation - Inter
    navigation: {
      fontFamily: "Inter",
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "600" as const,
    },

    // Input Label - Plus Jakarta Sans
    inputLabel: {
      fontFamily: "PlusJakartaSans",
      fontSize: 12,
      lineHeight: 16,
      fontWeight: "400" as const,
    },
  },
};

export type TypographyStyle = keyof typeof theme.typography;
