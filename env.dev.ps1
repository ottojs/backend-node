#!/usr/bin/env pwsh

$env:NODE_ENV = "development";
$env:LISTEN = "127.0.0.1";
$env:PORT = "8080";
$env:DEBUG = "app:*";
$env:SQL_URI = "postgresql://localuser:localroot@127.0.0.1:5432/localdb?connect_timeout=10&sslmode=disable";
$env:COOKIE_SECRET = "cookie-secret";
$env:GCP_BUCKET_NAME = "cdn.example.com";
$env:GCP_STORAGE_CONFIG = '{"projectId":"example","keyFilename":"example.json"}';
$env:EMAIL_PROVIDER = "preview";
$env:EMAIL_SENDGRID_API_KEY = "disabled";
