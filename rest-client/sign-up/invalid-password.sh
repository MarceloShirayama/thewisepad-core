#!/usr/bin/sh

source ../../.env

if test -z $SERVER_PORT_TESTS; then
  PORT="3000"
else
  PORT=$SERVER_PORT_TESTS
fi

# invalid password
curl -v -H "Connection: close" POST http://localhost:$PORT/api/sign-up \
  -H 'Content-Type: application/json' \
  -d '{"email":"any@mail.com","password":"invalid_Password"}' | jq

# expect:

# headers
# < HTTP/1.1 400 Bad Request
# ...

# body
# {
#   "name": "InvalidPasswordError",
#   "_statusCode": 400
# }
