import React, { useState, useEffect, useRef } from "react";
import { View, Linking } from "react-native";
import { Headline, ActivityIndicator, Divider } from "react-native-paper";
import { WebView } from "react-native-webview";

import api from "../util/api.js";

export default function UpdateData(props) {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const id = props.id;
  const ref = useRef(null);

  async function loadPost() {
    try {
      setData(await api.getPost(id));
    } catch (error) {
      console.warn(error);
    }
  }

  useEffect(() => {
    if (data === undefined) {
      loadPost();
    }
  }, [data]);

  if (data === undefined) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator indeterminate size="large" />
      </View>
    );
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${data.title}</title>
        <style>
          html, body {
            margin: 0;
          }

          * {
            font-family: sans-serif;
          }
        </style>
      </head>
      <body>
        ${data.content}
        <script>
          window.ReactNativeWebView.postMessage("onload");
        </script>
      </body>
    </html>
  `;

  return (
    <>
      {loading && (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator indeterminate size="large" />
        </View>
      )}
      <View style={{ flex: 1, padding: 8, display: loading ? "none" : "flex" }}>
        <Headline>{data.title}</Headline>
        <Divider />
        <WebView
          ref={ref}
          originWhitelist={["*"]}
          style={{ backgroundColor: "transparent" }}
          source={{ html: htmlContent }}
          onMessage={({ nativeEvent: { data } }) =>
            data === "onload" && setLoading(false)
          }
          onNavigationStateChange={(event) => {
            if (event.url !== "about:blank") {
              ref.current.stopLoading();
              Linking.openURL(event.url);
            }
          }}
        />
      </View>
    </>
  );
}
