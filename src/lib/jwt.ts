import { SignJWT, jwtVerify } from 'jose';

const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret || secret.length === 0) {
        // throw new Error('The environment variable JWT_SECRET_KEY is not set.');
        // Fallback for development if not provided
        return new TextEncoder().encode('fallback_secret_key_for_matkacalc_dev');
    }
    return new TextEncoder().encode(secret);
};

export async function signJwtToken(payload: any) {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60 * 24 * 7; // 7 days

    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(getJwtSecretKey());
}

export async function verifyJwtToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, getJwtSecretKey());
        return payload;
    } catch (error) {
        console.error('Failed to verify token:', error);
        return null;
    }
}
