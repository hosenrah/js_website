#!/bin/bash
set -x
if [ $TRAVIS_BRANCH == 'master' ] ; then
    scp -r bower_components u74789873@s493274694.online.de:js_website/bower_components
    scp -r node_modules u74789873@s493274694.online.de:js_website/node_modules
    scp -r js u74789873@s493274694.online.de:js_website/js
    scp index.html u74789873@s493274694.online.de:js_website/index.html
    echo "Deployed to Webserver."
else
    echo "Not deploying, since this branch isn't master."
fi