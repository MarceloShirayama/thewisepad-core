# sign-up valid user
curl -s -H "Connection: close" POST http://localhost:3000/api/sign-up \
  -H 'Content-Type: application/json' \
  -d '{"email":"any@mail.com","password":"valid_Password_1"}' | jq

sleep 0.5

# sign-up another user
# curl -v -H "Connection: close" POST http://localhost:3000/api/sign-up \
#   -H 'Content-Type: application/json' \
#   -d '{"email":"another@mail.com","password":"valid_Password_2"}' | jq

# sleep 0.5

# sign-in
TOKEN=$(curl -s -H "Connection: close" POST http://localhost:3000/api/sign-in \
  -H 'Content-Type: application/json' \
  -d '{"email":"any@mail.com","password":"valid_Password_1"}' | jq -r '.accessToken')

sleep 0.5

# create note
curl -s -H "Connection: close" POST http://localhost:3000/api/notes \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'x-access-token: '$TOKEN \
  -d '{"title":"any title",
        "content": "any content",
        "ownerEmail": "another@mail.com",
        "ownerId": "1"
      }' | jq
