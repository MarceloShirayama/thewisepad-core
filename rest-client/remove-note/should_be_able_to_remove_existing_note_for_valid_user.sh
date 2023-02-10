#!/usr/bin/sh

# should be able to remove existing note for valid user

# variables
URL_SIGNUP=http://localhost:3000/api/sign-up
URL_SIGNIN=http://localhost:3000/api/sign-in
URL_NOTES=http://localhost:3000/api/notes
VALID_USER_EMAIL=any@mail.com
VALID_USER_PASSWORD=valid_Password_1

echo sign-up
ID=$(curl -s -v -H POST $URL_SIGNUP \
  -H 'Content-Type:application/json' \
  -d '{"email":"'$VALID_USER_EMAIL'","password":"'$VALID_USER_PASSWORD'"}' | jq -r '.id')

sleep 0.5
echo '===================================================='

# sign-in
SIGNIN_RESPONSE=$(curl -s -v -H POST $URL_SIGNIN \
  -H 'Content-Type:application/json' \
  -d '{"email":"'$VALID_USER_EMAIL'","password":"'$VALID_USER_PASSWORD'"}')

TOKEN=$(echo $SIGNIN_RESPONSE | jq -r '.accessToken')

sleep 0.5
echo '===================================================='

echo create note
CREATE_NOTE_RESPONSE=$(curl -s -v -H POST $URL_NOTES \
  -H 'Content-Type:application/json' \
  -H 'Accept:application/json' \
  -H 'x-access-token:'$TOKEN \
  -d '{
        "title":"any title",
        "content": "any content",
        "ownerEmail": "'$VALID_USER_EMAIL'",
        "ownerId": "'$ID'"
      }')

echo $CREATE_NOTE_RESPONSE | jq
NOTE_ID=$(echo $CREATE_NOTE_RESPONSE | jq -r '.id')
OWNER_ID=$(echo $CREATE_NOTE_RESPONSE | jq -r '.ownerId')

sleep 0.5
echo '===================================================='

echo remove note
REMOVE_NOTE=$(curl -s -v -X DELETE $URL_NOTES/$NOTE_ID \
  -H 'Content-Type:application/json' \
  -H 'Accept:application/json' \
  -H 'x-access-token:'$TOKEN \
  -d '{
        "noteId":"'$NOTE_ID'",
        "userId": "'$OWNER_ID'"
      }')

echo $REMOVE_NOTE | jq
