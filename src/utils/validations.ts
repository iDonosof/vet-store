export const validateStringInputs = (input: { [key: string]: string | number }): void => {
    const keys: string[] = Object.keys(input);
    keys.forEach((key: string): void => {
        const value: string | number = input[key];
        if (!value) {
            throw new Error(`Invalid parameter, ${key} can't be null or empty`);
        }
    });
};
