###Setting up Mobile Environment and run OCMiniQuote as Mobile App

Prerequisites:

 - For Android, Java SDK 1.8 or later. Path of JAVA_HOME to be configured in Advanced tab > Environment Variables.
 - For iOS app, machine running on MAC OS X El Capitan is mandatory.
 - For Cordova, Node.js and GIT client has to be installed and configured



 Android Installation:

 - Download Android Studio for Windows/Mac from the link below

 	https://developer.android.com/studio/index.html

 - After download, install a Standard Setup of Android Studio. 

 - Click Configure on the bottom of the pane -> SDK Manager -> Lauch Standalone SDK Manager. For first installation Studio might prompt to install the SDK in specified location.

 - In SDK Manager, Select the checkboxes Android SDK Tools, Android SDK Platform-tools, Android 6.0 (API 23), Android 5.1.1 (API 22), Intel x86 Emulator and Google USB Driver (Only for Windows) and install the SDK's.

 
 iOS Installation:

 - Open App Store on the MAC machine and search for Xcode from the store. Install the latest version of Xcode.
  
 - This will download and install Xcode and the latest versions of iOS platforms along with it.

 Cordova Installation: 

 - Cordova has to be installed on the machine using npm. Details steps of installation can be found in the link below

 	https://cordova.apache.org/docs/en/latest/guide/cli/index.html

 - Once installed open CMD prompt(windows) or Terminal(Mac) and type cordova -v . This displays the version of cordova installed.


 To build the app from client-infrastructure code on MacOS X and later:

 (Note: npm-install has to be run on the client-infrastructure folder before building the mobile package. Refer Readme of OmniChannel-Infrastructure for complete details)

 - Navigate to mobile-infrastructure folder from Terminal

 - Run the shell command configcordova.sh with the following parameters in same order 

 		sh configcordova.sh create 
 		sh configcordova.sh addresources

 - The above shell scripts will create a new Cordova Project, add the configuration files, copy the image assets, pull the code from client-infrastructe folder and will place a mobile deployment ready code in mobile-infrastructure/OCMiniQuote/www folder. 

 - To ignore the SSL certificates, modifications had to be done to the Cordova library files. Read the below blog post and make the necessary changes before building the mobile app

 	http://ivancevich.me/articles/ignoring-invalid-ssl-certificates-on-cordova-android-ios/

 - Run the shell command buildbinaries.sh with following parameters in the same order

 		sh buildbinaries.sh buildios
 		sh buildbinaries.sh buildandroid


 - The first command will build the iOS application and will put the ipa in the mobile-infrastructure/OCMiniQuote/platforms/ios/build/device folder. Note: To build and sign the ipa with the CSC Apple Enterprise Certificate, you need to download the CSC Apple P12 Certificate from C3, the Mini Quote provisioning profile from the Apple Developer website and install on the local machine.

 - The second command will build the Android app and will put the apk in the mobile-infrastructure/OCMiniQuote/platforms/android/build/outputs/apk folder.


 To build the app from client-infrastructure code on Windows 7 and later:

 - Windows OS cannot run the shell scripts natively. So, we need to install Cygwin, a linux based terminal on Windows to execute Shell scripts. It can be installed from the link below:

 	https://www.cygwin.com/

 - Once installed open Cygwin terminal from the installed location and navigate to mobile-infrastructure folder using 'cd' commands of linux

 - Run the shell command configcordova.sh with the following parameters in same order 

 		dos2unix configcordova.sh
 		bash configcordova.sh create 
 		bash configcordova.sh addresources

 - The above shell scripts will create a new Cordova Project, add the configuration files, copy the image assets, pull the code from client-infrastructe folder and will place a mobile deployment ready code in mobile-infrastructure/OCMiniQuote/www folder. 

 - To ignore the SSL certificates, modifications had to be done to the Cordova library files. Read the below blog post and make the necessary changes before building the mobile app

 	http://ivancevich.me/articles/ignoring-invalid-ssl-certificates-on-cordova-android-ios/

 - Run the shell command buildbinaries.sh with following parameters in the same order

 		dos2unix buildbinaries.sh
 		bash buildbinaries.sh buildandroid


 - The first command will convert the editor based script into the unix compatible script to run as shell script.

 - The second command will build the Android app and will put the apk in the mobile-infrastructure/OCMiniQuote/platforms/android/build/outputs/apk folder.


To run the mobile app code on iOS Simulator:

- From Finder navigate to mobile-infrastructure/OCMiniQuote/platforms/ios folder. You can find OCMiniQuote.xcodeproj in that location. Double clicking on it will open the project in Xcode.

- Select the ios simulator that you want to run the app on and click Run.

- If the simulator that you want to run on doesn't show up, you need to download the simulators from Xcode. Process can be found in the link below.

	https://developer.apple.com/library/ios/recipes/xcode_help-documentation_preferences/Articles/DownloadingandInstallingXcodeComponents.html


To run the mobile app code on Android Emulator:

Since Android Emulator requires huge amount of system resources, it is highly recommended to use a optimised version of emultor developed by Intel. The steps to configure and install the Intel HAXM emulator is explained in the link below:

https://software.intel.com/en-us/android/articles/intel-hardware-accelerated-execution-manager

- Open Android Studio -> Click open existing project and navigate to the below location and click open project
	mobile-infrastructure/OCMiniQuote/platforms/android/ 

- This will open the app code in the right panel while the project hierarchy can be found in the left panel. For the first time, Gradle sync might take couple of minutes.

- Once gradle sync is done, Click on Run button on the top panel. It will display a prompt to create a new AVD(Android Virual Device). The prompt might differ, but there will be Crete New Emulator in the pane.

- In the next pane(Select Hardware Pane), Select Tablet -> Nexus 10 -> Click Next

- In the System Image pane, select any Android SDK Version that we have installed previously. For example: If Android SDK 23 is installed, select Marshmallow. Make sure to select X86 images that is mentioned in the ABI options. Click Next

- In the verify configuration name, change the AVD name and click Finish.

- This will create a new AVD and will run the app. From consequent runs of the app, the AVD will be selected by default or a pop up will display with the name of the AVD that you have just created.

Note: If your system RAM is low, while verying the configuration of the AVD, click Show Advanced settings where you can modify the RAM, VM Heap size. Lower these values if you are running on lower system configurations.
