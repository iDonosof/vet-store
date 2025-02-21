import bcrypt from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "../common/constants";

const encrypt = (input: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(BCRYPT_SALT_ROUNDS, function (salt_error, salt) {
            if (salt_error) {
                reject(salt_error);
                return;
            }
            bcrypt.hash(input, salt, function (hash_error, hash: string) {
                if (hash_error) {
                    reject(hash_error);
                    return;
                }
                resolve(hash);
            });
        });
    });
};

const compare = (input: string, hash: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(input, hash, function (err, result) {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
};

export { encrypt, compare };
