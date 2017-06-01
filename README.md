### Tech Day project
Build an iOS / Android Dashboard App in React Native.

| Login | Home | Account |
| --- | --- | --- |
| <img src="screenshot_login.png" alt="Home screen" width="250"> | <img src="screenshot_dashboard.png" alt="Home screen" width="250"> |<img src="screenshot_account.png" alt="Home screen" width="250"> |

### Installation
Ensure you have the [necessary tools and dependencies](https://facebook.github.io/react-native/docs/getting-started.html) to develop an application.

Once you're setup, simply run

```bash
$ yarn # or npm install
$ react-native link # configure native package dependencies
$ react-native run-ios # this will start the native packager and spawn the iOS simulator
```

Alternatively, simply open the project in Xcode and run it from there.

### Upgrading

See https://facebook.github.io/react-native/docs/upgrading.html

```bash
$ react-native upgrade # useful in case of breaking changes
```

#### TODOs
- change cards UI
  - numbers should be bigger, more visible
  - better use of the space
  - top products data should be shown differently
- better project switcher (show inactive projects)
- currency selector
- unit tests
- persist dashboard data as well
- flow types
- fading animation for placeholder elements
- svg animated logo
- better error notifications
- small example of push notification when new orders come in
- translations (e.g. german)
