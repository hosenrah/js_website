#!/bin/bash
set -x
if [ $TRAVIS_BRANCH == 'master' ] ; then
    scp -r . u74789873@s493274694.online.de:js_website
    echo "Deployed to Webserver."
else
    echo "Not deploying, since this branch isn't master."
fi