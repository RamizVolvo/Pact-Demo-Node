#!/bin/bash

SUCCESS=true
if [ "${1}" != "true" ]; then
  SUCCESS=false
fi
OAS=$(cat ./oas.yaml | base64 -w 0)
version="$(git rev-parse --short HEAD)"
#echo -n "$OAS"
REPORT=$(cat ./Report.txt | base64)
PACT_BROKER_TOKEN=oFp-wMAJuWO6XxtRfFBsOA
PACT_BROKER_BASE_URL=https://volvo.pactflow.io
PACTICIPANT=DotNetProductService

echo "==> Uploading OAS to Pactflow"
echo '{
   "content": "'$OAS'",
   "contractType": "oas",
   "contentType": "application/yaml",
   "verificationResults": {
     "success": '$SUCCESS',
     "content": "'$REPORT'",
     "contentType": "text/plain",
     "verifier": "verifier"
     }
   }' >> postdata.txt
#cat postdata.txt
curl \
  -X PUT \
  -H "Authorization: Bearer $PACT_BROKER_TOKEN" \
  -H "Content-Type: application/json" \
  "$PACT_BROKER_BASE_URL/contracts/provider/$PACTICIPANT/version/$version" \
  -d @postdata.txt
rm postdata.txt