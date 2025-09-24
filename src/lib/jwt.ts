import jwt, {JwtPayload, SignOptions} from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "7d") as `${number}${'d'|'h'|'m'|'s'}`;

if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined in environment variables");

export function signToken(payload: Record<string, any>) {
    const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };

    return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload | string | null {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
}

export function getUserFromAuthHeader(authHeader?: string | null) {
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    const token = authHeader.split(" ")[1];
    return verifyToken(token);
}