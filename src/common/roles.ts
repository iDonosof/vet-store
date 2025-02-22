import Role from "../types/role";

// Pattern for each right: action_resource
// Example: "Super Admin": ["read_user", "create_user", "update_user", "delete_user"]

const roles: { [key: string]: Role } = {
    "Super Admin": {
        id: 1,
        name: "Super Admin",
        translations: {
            en: "Super Admin",
            es: "Super Administrador",
        },
        rights: [
            "read_user",
            "create_user",
            "update_user",
            "delete_user",
            "read_role",
            "create_role",
            "update_role",
            "create_category",
            "update_category",
            "delete_category",
            "read_product",
            "create_product",
            "update_product",
            "delete_product",
        ],
    },
    Admin: {
        id: 2,
        name: "Admin",
        translations: {
            en: "Admin",
            es: "Administrador",
        },
        rights: [
            "read_user",
            "create_user",
            "update_user",
            "delete_user",
            "read_role",
            "read_category",
            "create_category",
            "update_category",
            "delete_category",
            "read_product",
            "create_product",
            "update_product",
            "delete_product",
        ],
    },
    Veterinarian: {
        id: 3,
        name: "Veterinarian",
        translations: {
            en: "Veterinarian",
            es: "Veterinario",
        },
        rights: [
            "read_user",
            "update_user",
            "read_category",
            "create_category",
            "update_category",
            "read_product",
            "create_product",
        ],
    },
    Seller: {
        id: 4,
        name: "Seller",
        translations: {
            en: "Seller",
            es: "Vendedor",
        },
        rights: [
            "read_user",
            "update_user",
            "read_category",
            "create_category",
            "update_category",
            "read_product",
            "create_product",
        ],
    },
    Client: {
        id: 5,
        name: "Client",
        translations: {
            en: "Client",
            es: "Cliente",
        },
        rights: ["read_category", "read_product"],
    },
};

export default roles;
