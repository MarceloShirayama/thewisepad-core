# invalid password
curl -v -H POST http://localhost:3000/api/sign-up \
  -H 'Content-Type: application/json' \
  -d '{"email":"any@mail.com","password":"invalid_Password"}' | jq

# expect:

# headers
# < HTTP/1.1 400 Bad Request

# body
# {
#   "name": "InvalidPasswordError",
#   "_statusCode": 400
# }
