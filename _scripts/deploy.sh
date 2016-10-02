#!/bin/bash
set -x
if [ $TRAVIS_BRANCH == 'master' ] ; then
    scp -r js u74789873@s493274694.online.de:js_website/js
    scp -r css u74789873@s493274694.online.de:js_website/css
    scp -r img u74789873@s493274694.online.de:js_website/img    
    scp index.html u74789873@s493274694.online.de:js_website/index.html
    echo "Deployed to Webserver."
else
    echo "Not deploying, since this branch isn't master."
fi