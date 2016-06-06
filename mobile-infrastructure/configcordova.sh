#!/bin/sh

echo $PWD  

# Below parameter will create a new Cordova Project along with the corresponding plugins
if [ "$1" = "create" ]; then
        rm -r OCMiniQuote
        cordova create OCMiniQuote com.csc.e.omnichannel.miniquote OCMiniQuote
        cd OCMiniQuote
        cordova platform add ios --save
        cordova platform add android --save
        cordova plugin add cordova-plugin-console
        cordova plugin add cordova-plugin-splashscreen
        cordova plugin add cordova-plugin-device-orientation
        cordova plugin add cordova-plugin-device



fi

# Below parameter will add the image resources, config file and build file into the Cordova Project
if [ "$1" = "addresources" ]; then
        rm -r OCMiniQuote/platforms/ios/OCMiniQuote/Images.xcassets
        rm -r OCMiniQuote/platforms/android/res
        rm OCMiniQuote/config.xml
        cp -r res/ OCMiniQuote/platforms/android/res
        cp -r Images.xcassets/ OCMiniQuote/platforms/ios/OCMiniQuote/Images.xcassets
        cp -r config.xml OCMiniQuote
        cp -r build.json OCMiniQuote
        cd ..
        cd client-infrastructure
        echo $PWD
        grunt buildMobilePkg --force

fi
       
       
