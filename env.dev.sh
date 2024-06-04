#!/usr/bin/env bash

export NODE_ENV="development";
export LISTEN="127.0.0.1";
export PORT="8080";
export DEBUG="app:*";
export SQL_URI="postgresql://localuser:localroot@127.0.0.1:5432/localdb?connect_timeout=10&sslmode=disable";
