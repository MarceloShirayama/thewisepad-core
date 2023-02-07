# valid email and valid password
curl -v -H POST http://localhost:3000/api/sign-up \
  -H 'Content-Type: application/json' \
  -d '{"email":"any@mail.com","password":"valid_Password_1"}' | jq

# executing only once
# expect:

# headers
# < HTTP/1.1 201 Created
# < access-control-allow-origin: *
# < access-control-allow-headers: *
# < access-control-allow-methods: *
# < Content-Type: application/json; charset=utf-8

# body
# {
#   "email": "any@mail.com",
#   "password": "valid_Password_1-ENCRYPTED",
#   "id": "0"
# }

# # running more than once
# #expect

# headers
# < HTTP/1.1 403 Forbidden

# body
# {
#   "name": "ExistingUserError",
#   "_statusCode": 403
# }
