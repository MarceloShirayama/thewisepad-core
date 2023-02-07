curl -v -H POST http://localhost:3000/api/sign-up \
  -H 'Content-Type: application/json' \
  -d '{"email":"any@mail.com","password":"valid_Password_1"}' | jq

# executing only once
# expect:

# headers
# < HTTP/1.1 201 Created
# ...

# body
# {
#   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTI4ZDFjMjA0NjNjZTk2YTMwNmI2YiIsImlhdCI6MTY3NTc5MTY0NH0.2EaLNjgmwTzVSDObw5--OKOt-a73b7YD1Y_zte9AHEs",
#   "id": "63e28d1c20463ce96a306b6b"
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

sleep 1

curl -v -H POST http://localhost:3000/api/sign-in \
  -H 'Content-Type: application/json' \
  -d '{"email":"any@mail.com","password":"valid_Password_1"}' | jq

# expect:

# headers
# < HTTP/1.1 200 OK
# ...

# body
# {
#   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTI4ZDFjMjA0NjNjZTk2YTMwNmI2YiIsImlhdCI6MTY3NTc5MTY0NX0.dtNRNnUrbZXgy09_rEjFIl4KRRmpkJ_DK1kHd606gAo",
#   "id": "63e28d1c20463ce96a306b6b"
# }
