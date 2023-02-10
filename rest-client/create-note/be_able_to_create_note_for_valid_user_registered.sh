# sign-up
ID=$(curl -s -v -H POST http://localhost:3000/api/sign-up \
  -H 'Content-Type:application/json' \
  -d '{"email":"any@mail.com","password":"valid_Password_1"}' | jq -r '.id')

sleep 0.5
echo '===================================================='

# sign-in
TOKEN=$(curl -s -v -H POST http://localhost:3000/api/sign-in \
  -H 'Content-Type:application/json' \
  -d '{"email":"any@mail.com","password":"valid_Password_1"}' | jq -r '.accessToken')

sleep 0.5
echo '===================================================='

# create note
curl -s -v -H POST http://localhost:3000/api/notes \
  -H 'Content-Type:application/json' \
  -H 'Accept:application/json' \
  -H 'x-access-token:'$TOKEN \
  -d '{
        "title":"any title",
        "content": "any content",
        "ownerEmail": "any@mail.com",
        "ownerId": "'$ID'"
      }' | jq
