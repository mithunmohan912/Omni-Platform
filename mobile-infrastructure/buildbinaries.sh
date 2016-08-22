#!/bin/sh
 
echo $PWD/OCMiniQuote
cd $PWD/OCMiniQuote

# Below parameter builds the iOS app and creates the ipa file in the device folder

if [ "$1" = "buildios" ]; then
  echo "iOS Build triggerred"
  cordova clean ios
	cordova build ios --release --buildConfig=build.json
	cordova build ios --device

fi

# Below parameter builds the android app and creates the apk file in the build folder

if [ "$1" = "buildandroid" ]; then
        echo "Android Build triggerred"
        # Below export commands are only for Mac OS when the path of Android SDK is needed for building the app. 
        # For Mac OS the ANDROID_HOME path has to be replaced with the actual path of Android SDK on the machine
        # Not required for Windows if path is set in Environment Variable
        export ANDROID_HOME=/Users/CSCMobility/Documents/Android/adt-bundle-mac-x86_64-20140321/sdk
        export PATH=$PATH:$ANDROID_HOME/bin
        cordova clean android
        cordova build android

fi
