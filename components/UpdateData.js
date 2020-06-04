import React, { useState, useEffect, useRef } from "react";
import { View, Linking } from "react-native";
import {
  Headline,
  ActivityIndicator,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Card,
  List,
} from "react-native-paper";
import { WebView } from "react-native-webview";

import api from "../util/api.js";
import { getExtensionNoDot, downloadFile, openFile } from "../util/files.js";

export default function UpdateData(props) {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const id = props.id;
  const ref = useRef(null);

  async function loadPost() {
    try {
      const res = await api.getPost(id);
      if (res.success) {
        setData(res.data);
      } else {
        console.warn("Failed to get post data with status " + res.status);
      }
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
      <View style={{ flex: 1, display: loading ? "none" : "flex" }}>
        <View style={{ flex: 1 }}>
          <Headline style={{ marginVertical: 8 }}>{data.title}</Headline>
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
        <View style={{ marginTop: 8, marginBottom: 16 }}>
          <View style={{ flexDirection: "row" }}>
            {data.tags && data.tags.length > 0 ? (
              data.tags.map((tag) => (
                <Chip key={tag.id} mode="outlined" style={{ margin: 4 }}>
                  {tag.name}
                </Chip>
              ))
            ) : (
              <Chip mode="outlined" icon="tag-remove" style={{ margin: 4 }}>
                No tags
              </Chip>
            )}
          </View>
        </View>
        <View>
          {data.files.length > 0 && (
            <Card style={{ marginBottom: 20 }}>
              <List.Accordion
                title="Attached files"
                left={(props) => <List.Icon {...props} icon="file" />}
              >
                {data.files.map((file) => (
                  <List.Item
                    key={file.id}
                    title={file.name}
                    left={() => (
                      <Avatar.Text
                        style={{ marginRight: 10 }}
                        size={40}
                        label="PDF"
                      />
                    )}
                    left={(props) => {
                      const extension = getExtensionNoDot(
                        file.name
                      ).toUpperCase();
                      if (getExtensionNoDot(file.name).length <= 3) {
                        return (
                          <Avatar.Text
                            style={{ marginRight: 10 }}
                            size={40}
                            label={extension}
                          />
                        );
                      }
                      return (
                        <Avatar.Icon
                          style={{ marginRight: 10 }}
                          size={40}
                          icon="file"
                        />
                      );
                    }}
                    right={(props) => (
                      <IconButton
                        {...props}
                        icon="arrow-down"
                        onPress={() => {
                          downloadFile(
                            api.baseUrl + "/api/rawfiles/download/" + file.id,
                            file.id,
                            file.name
                          );
                        }}
                      />
                    )}
                    onPress={() =>
                      openFile(
                        api.baseUrl + "/api/rawfiles/download/" + file.id,
                        file.id,
                        file.name
                      )
                    }
                  />
                ))}
              </List.Accordion>
            </Card>
          )}
        </View>
      </View>
    </>
  );
}
