#!/bin/bash
set -x # Show the output of the following commands (useful for debugging)
    
# Import the SSH deployment key
openssl aes-256-cbc -K $encrypted_f68595d96691_key -iv $encrypted_f68595d96691_iv -in id_rsa.enc -out id_rsa -d
rm deploy-key.enc # Don't need it anymore
chmod 600 deploy-key
mv deploy-key ~/.ssh/id_rsa