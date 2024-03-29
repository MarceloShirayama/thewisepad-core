#!/usr/bin/sh

source ../../.env

if test -z $SERVER_PORT_TESTS; then
  PORT="3000"
else
  PORT=$SERVER_PORT_TESTS
fi

# valid email and valid password
curl -v -H "Connection: close" POST http://localhost:$PORT/api/sign-up \
  -H 'Content-Type: application/json' \
  -d '{"email":"any@mail.com","password":"valid_Password_1"}' | jq

# executing only once
# expect:

# headers
# < HTTP/1.1 201 Created
# ...

# body
# {
#   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTIyYTMwN2UzOTkzYmJjY2VkZDkyZCIsImlhdCI6MTY3NTc2NjMyMX0.Z5aKmj3GA_67c_ryTnJ_I-Uz9kSz-EEzHVl-bB8Jsio",
#   "id": "63e22a307e3993bbccedd92d"
# }

# # running more than once
# #expect

# headers
# < HTTP/1.1 403 Forbidden
# ...

# body
# {
#   "name": "ExistingUserError",
#   "_statusCode": 403
# }
