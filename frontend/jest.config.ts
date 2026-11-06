import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jsdom",
  testMatch: ["**/__tests__/**/*.test.ts"],
};

export default createJestConfig(customJestConfig);

