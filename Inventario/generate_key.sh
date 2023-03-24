keytool -genkey -v -keystore inventario.keystore -alias inventario -validity 10000 
keytool -genkey -v -keystore inventario.keystore -alias inventario -keyalg RSA -keysize 2048 -validity 10000

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/cordova/Inventario/inventario.keystore app-release-unsigned.apk inventario
zipalign -v 4 app-release-unsigned.apk Inventario.apk

cordova build android --release -- --packageType=apk
