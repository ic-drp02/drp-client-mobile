import React, { useCallback } from "react";
import { ScrollView } from "react-native";

export default function InfiniteScrollView({
  onEndReached,
  onEndReachedThreshold,
  children,
}) {
  const isCloseToBottom = useCallback(
    ({ layoutMeasurement, contentOffset, contentSize }) => {
      const paddingToBottom = onEndReachedThreshold ? onEndReachedThreshold : 0;
      return (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
      );
    },
    [onEndReachedThreshold]
  );

  return (
    <ScrollView
      onScroll={({ nativeEvent }) => {
        if (isCloseToBottom(nativeEvent)) {
          onEndReached();
        }
      }}
      scrollEventThrottle={500}
      contentContainerStyle={{ padding: 16 }}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}
