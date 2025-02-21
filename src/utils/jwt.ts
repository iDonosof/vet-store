import { sign, verify, JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/enviroment";

export const generate_token = (claims: { [key: string]: string }): string => {
    return sign(claims, JWT_SECRET, { expiresIn: "1h" });
};

export const validate_token = (token: string): JwtPayload => {
    const claims = verify(token, JWT_SECRET) as JwtPayload;
    return claims;
};
