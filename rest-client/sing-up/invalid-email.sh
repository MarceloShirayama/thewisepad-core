# invalid email
curl -v -H POST http://localhost:3000/api/sign-up \
  -H 'Content-Type: application/json' \
  -d '{"email":"invalid_mail.com","password":"valid_Password_1"}' | jq

# expect:

# headers
# < HTTP/1.1 400 Bad Request
# ...

# body
# {
#   "name": "InvalidEmailError",
#   "_statusCode": 400
# }
