<?php
namespace App\Helpers;

class JWT {

    private static $secret = 'CLAVE_SECRETA_SUPER_SEGURA_123456';

    public static function encode(array $payload): string {
        $header = ['alg' => 'HS256', 'typ' => 'JWT'];

        $segments = [];
        $segments[] = self::base64url_encode(json_encode($header));
        $segments[] = self::base64url_encode(json_encode($payload));

        $signature = hash_hmac('sha256',
            implode('.', $segments),
            self::$secret,
            true
        );

        $segments[] = self::base64url_encode($signature);

        return implode('.', $segments);
    }

    public static function decode(string $jwt) {
        $parts = explode('.', $jwt);
        if (count($parts) !== 3) return false;

        [$header64, $payload64, $signature64] = $parts;

        $payload = json_decode(self::base64url_decode($payload64), true);
        if (!$payload) return false;

        // comprobar expiración
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return false;
        }

        // verificar firma
        $signature = self::base64url_decode($signature64);
        $validSig = hash_hmac('sha256',
            "$header64.$payload64",
            self::$secret,
            true
        );

        if (!hash_equals($validSig, $signature)) {
            return false;
        }

        return $payload;
    }

    private static function base64url_encode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64url_decode($data) {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
