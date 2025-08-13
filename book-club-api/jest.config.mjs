export default {
    testEnvironment: "node",
    transform: {},                    
    setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
    testMatch: ["**/tests/**/*.test.js"],
    testTimeout: 30000,         
    verbose: true
  };
  