#!/bin/sh
#export ANDROID_SDK_ROOT=/home/chris/android-sdk/
#export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools/
#export PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin/
#export PATH=$PATH:$ANDROID_SDK_ROOT/emulator/

PROJECT_DIR="/home/chris/Projetos/Inventario"
RELEASE_APK="$PROJECT_DIR/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk"

cordova build android --release -- --packageType=apk &&
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "$PROJECT_DIR/inventario.keystore" $RELEASE_APK inventario &&
zipalign -v 4 $RELEASE_APK Inventario.apk &&
echo "Done!"

