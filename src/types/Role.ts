type Role = {
    id: number;
    name: string;
    translations?: { [key: string]: string };
    rights: string[];
};

export default Role;
