#!/usr/bin/sh

source ../../.env

if test -z $SERVER_PORT_TESTS; then
  PORT="3000"
else
  PORT=$SERVER_PORT_TESTS
fi

URL_SIGNUP=http://localhost:$PORT/api/sign-up
URL_SIGNIN=http://localhost:$PORT/api/sign-in
URL_NOTES=http://localhost:$PORT/api/notes
VALID_USER_EMAIL=any@mail.com
VALID_USER_PASSWORD=valid_Password_1
ANOTHER_VALID_USER_EMAIL=another@mail.com
ANOTHER_VALID_USER_PASSWORD=valid_Password_2

echo sign-up valid user
curl -s -v -H POST $URL_SIGNUP \
  -H 'Content-Type: application/json' \
  -d '{"email": "'$VALID_USER_EMAIL'","password":"'$VALID_USER_PASSWORD'"}' | jq

sleep 0.5
echo '===================================================='

echo sign-up another user
RESPONSE_SIGNUP=$(curl -s -v -H POST $URL_SIGNUP \
  -H 'Content-Type:application/json' \
  -d '{"email":"'$ANOTHER_VALID_USER_EMAIL'","password":"'$ANOTHER_VALID_USER_PASSWORD'"}')

echo $RESPONSE_SIGNUP | jq
ID_ANOTHER_USER=$(echo $RESPONSE_SIGNUP | jq -r '.id')

sleep 0.5
echo '===================================================='

echo sign-in valid user
RESPONSE_SIGNIN=$(curl -s -v -H POST $URL_SIGNIN \
  -H 'Content-Type:application/json' \
  -d '{"email": "'$VALID_USER_EMAIL'","password":"'$VALID_USER_PASSWORD'"}')

echo $RESPONSE_SIGNIN | jq
TOKEN=$(echo $RESPONSE_SIGNIN | jq -r '.accessToken')

sleep 0.5
echo '===================================================='

echo create note
curl -v -s -v -H POST $URL_NOTES \
  -H 'Content-Type:application/json' \
  -H 'Accept:application/json' \
  -H 'x-access-token:'$TOKEN \
  -d '{"title":"any title",
        "content": "any content",
        "ownerEmail": "'$ANOTHER_VALID_USER_EMAIL'",
        "ownerId": "'$ID_ANOTHER_USER'"
      }' | jq
