#!/usr/bin/env bash

export NODE_ENV="development";
export LISTEN="127.0.0.1";
export PORT="8080";
export DEBUG="app:*";
export SQL_URI="postgresql://localuser:localroot@127.0.0.1:5432/localdb?connect_timeout=10&sslmode=disable";
export COOKIE_SECRET="cookie-secret";
export GCP_BUCKET_NAME="cdn.example.com";
export GCP_STORAGE_CONFIG='{"projectId":"example","keyFilename":"example.json"}';
export EMAIL_PROVIDER="preview";
export EMAIL_SENDGRID_API_KEY="disabled";
export EMAIL_MAILGUN_API_KEY="disabled";
export EMAIL_POSTMARK_API_KEY="disabled";
