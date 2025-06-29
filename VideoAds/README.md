# 📱 Android Video Ads SDK

This library allows Android developers to easily integrate full-screen video ads into their apps. Ads are fetched dynamically from a remote API and shown in an immersive, non-skippable format.

## 🚀 Features
- Full-screen video ads
- View & click tracking
- Location-based ad targeting
- Opens advertiser link on click

## 🛠 How to Use

```java
VideoAdsSdk.init(context);
VideoAdsSdk.showAd(context);
```

## 🔗 Integration

Add to your `build.gradle`:

```gradle
repositories {
    maven { url 'https://jitpack.io' }
}
dependencies {
    implementation 'com.github.YuvalG22:Video-Ads-SDK:v2.1'
}
```

## 📄 License

See main project LICENSE.