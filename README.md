# NHS Guidelines App - Mobile Client

## Local development

To build the app you will need to install [nodejs](https://nodejs.org/en/). Once that's installed, run the following:

```
> npm install -g expo-cli
```

Then in the project root you need to run:

```
> npm install
```

to install all the dependencies.

Finally, you can run:

```
> npm start
```

to build and run the app. This will display a QR code in the terminal that you can scan from the Expo client app on your phone to actually run the app on your device.

### API Server

By default, the app will connect to the API on the publicly deployed server. To use a local development server, set the `EXPO_API_SERVER_BASE` environment variable to the server address.
For example:

```
> export EXPO_API_SERVER_BASE="http://192.168.1.80:8000"
> npm start
```

The address should not be a loopback address (e.g. `localhost` or `127.0.0.1`) since it needs to be accessible from the device you are running the app on. You must bind
the server to `0.0.0.0` and then set the above variable to your machine's actual IP address on your LAN.

For detailed instructions on how to run a local server, see [https://github.com/ic-drp02/drp-server](https://github.com/ic-drp02/drp-server).
