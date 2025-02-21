import Role from "../types/role";

// Pattern for each right: action_resource
// Example: "Super Admin": ["read_user", "create_user", "update_user", "delete_user"]

const roles: { [key: string]: Role } = {
    "Super Admin": {
        id: 1,
        name: "Super Admin",
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
    Veterinario: {
        id: 3,
        name: "Veterinario",
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
    Vendedor: {
        id: 4,
        name: "Vendedor",
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
    Cliente: {
        id: 5,
        name: "Cliente",
        rights: ["read_category", "read_product"],
    },
};

export default roles;
