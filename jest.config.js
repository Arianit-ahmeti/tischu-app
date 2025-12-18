module.exports = {
  projects: [
    {
      displayName: "lib_tests",
      preset: "ts-jest",
      testEnvironment: "node",
      roots: ["<rootDir>/lib", "<rootDir>/__tests__/lib"],
      testMatch: ["<rootDir>/lib/**/*.test.{ts,tsx}", "<rootDir>/__tests__/lib/**/*.test.{ts,tsx}"],
      collectCoverageFrom: ["lib/**/*.ts", "!lib/**/*.d.ts"],
      moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
      transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
      },
      moduleNameMapper: {
        "^@lib/(.*)$": "<rootDir>/lib/$1",
        "^@types$": "<rootDir>/lib/types",
        "^@/(.*)$": "<rootDir>/$1",
      },
      setupFilesAfterEnv: ["<rootDir>/__tests__/lib_tests.setup.ts"],
    },
    {
      displayName: "components_tests",
      preset: "react-native",
      roots: ["<rootDir>/components", "<rootDir>/__tests__/components"],
      testMatch: ["<rootDir>/components/**/*.test.{ts,tsx}", "<rootDir>/__tests__/components/**/*.test.{ts,tsx}"],
      setupFilesAfterEnv: ["<rootDir>/__tests__/component_tests.setup.ts"],
      moduleNameMapper: {
        "^@components$": "<rootDir>/components/index.ts",
        "^@theme$": "<rootDir>/theme/theme.ts",
        "^@/(.*)$": "<rootDir>/$1",
        "^components/(.*)$": "<rootDir>/components/$1",
        "^theme/(.*)$": "<rootDir>/theme/$1",
      },
      transformIgnorePatterns: ["node_modules/(?!(react-native|@react-native|expo|@expo|@testing-library)/)"],
      collectCoverageFrom: ["components/**/*.{ts,tsx}", "!components/**/*.d.ts"],
    },
  ],
};
