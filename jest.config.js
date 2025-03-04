export default {
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
    testEnvironment: "node",
    transformIgnorePatterns: ["/node_modules/"],
};
