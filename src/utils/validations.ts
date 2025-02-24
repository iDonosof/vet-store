export const isValidInputs = (input: { [key: string]: string | number }): boolean => {
    const keys: string[] = Object.keys(input);
    for (const key of keys) {
        const value = input[key];
        if (!value) {
            return false;
        }
    }
    return true;
};
