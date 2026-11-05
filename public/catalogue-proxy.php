<?php
// Same-origin PDF proxy. Replaces src/app/api/catalogue-proxy/route.js.
// The browser can't fetch the PDF from mindmadeitech.com directly (CORS),
// so this file fetches it server-to-server and streams it back.

// Only these hosts can be proxied. Add the storage host here if it ever changes.
$allowedHosts = ['mindmadeitech.com'];

function fail($code, $message) {
    http_response_code($code);
    header('Content-Type: text/plain; charset=utf-8');
    echo $message;
    exit;
}

$targetUrl  = isset($_GET['url']) ? trim($_GET['url']) : '';
$isDownload = isset($_GET['download']) && $_GET['download'] === '1';
$filename   = isset($_GET['filename']) ? $_GET['filename'] : 'catalogue';

if ($targetUrl === '') {
    fail(400, 'Missing url parameter');
}

$parts = parse_url($targetUrl);
if (
    $parts === false ||
    empty($parts['scheme']) ||
    empty($parts['host']) ||
    !in_array(strtolower($parts['scheme']), ['http', 'https'], true)
) {
    fail(400, 'Invalid url parameter');
}

if (!in_array(strtolower($parts['host']), $allowedHosts, true)) {
    fail(403, 'URL host not allowed');
}

// Strip anything that would break the Content-Disposition header
$clean = trim(str_replace(['"', "\r", "\n"], '', $filename));
if ($clean === '') {
    $clean = 'catalogue';
}
if (strtolower(substr($clean, -4)) !== '.pdf') {
    $clean .= '.pdf';
}

$contentType = 'application/pdf';
$started = false;

$ch = curl_init($targetUrl);
curl_setopt_array($ch, [
    CURLOPT_FOLLOWLOCATION => false, // never follow redirects to other hosts
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_TIMEOUT        => 120,
    CURLOPT_PROTOCOLS      => CURLPROTO_HTTP | CURLPROTO_HTTPS,

    CURLOPT_HEADERFUNCTION => function ($ch, $line) use (&$contentType) {
        if (stripos($line, 'Content-Type:') === 0) {
            $value = trim(substr($line, 13));
            if ($value !== '') {
                $contentType = $value;
            }
        }
        return strlen($line);
    },

    CURLOPT_WRITEFUNCTION => function ($ch, $chunk) use (&$started, &$contentType, $isDownload, $clean) {
        if (!$started) {
            // Only pass a successful response through
            if (curl_getinfo($ch, CURLINFO_RESPONSE_CODE) !== 200) {
                return 0; // abort the transfer
            }
            header('Content-Type: ' . $contentType);
            header('Cache-Control: public, max-age=3600');
            if ($isDownload) {
                header('Content-Disposition: attachment; filename="' . $clean . '"');
            }
            $started = true;
        }
        echo $chunk;
        return strlen($chunk);
    },
]);

curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
curl_close($ch);

if (!$started) {
    fail($status >= 400 ? $status : 502, 'Failed to fetch upstream file');
}