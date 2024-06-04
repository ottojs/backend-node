#!/usr/bin/env pwsh

$env:NODE_ENV = "development";
$env:LISTEN = "127.0.0.1";
$env:PORT = "8080";
$env:DEBUG = "app:*";
$env:SQL_URI = "postgresql://localuser:localroot@127.0.0.1:5432/localdb?connect_timeout=10&sslmode=disable";
