import Status from "../types/Status";

export const USER_STATUS: { [key: string]: Status } = {
    ENABLED: {
        id: 1,
        name: "ENABLED",
    },
    DISABLED: {
        id: 2,
        name: "DISABLED",
    },
    BLOCKED: {
        id: 3,
        name: "BLOCKED",
    },
};

export const CATEGORY_STATUS: { [key: string]: Status } = {
    ENABLED: {
        id: 1,
        name: "ENABLED",
    },
    DISABLED: {
        id: 2,
        name: "DISABLED",
    },
};