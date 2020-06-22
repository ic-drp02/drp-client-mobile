import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Switch, useTheme } from "react-native-paper";

export default function GuidelinesView({ isGuideline, onSetGuideline }) {
  const theme = useTheme();
  return (
    <>
      {/* Guideline check */}
      <View style={styles.viewWithSpace}>
        <Text style={styles.guidelineText}>Is this a guideline?</Text>
        <Switch
          value={isGuideline}
          onValueChange={handleIsGuidelineChange}
          color={theme.colors.primary}
        />
      </View>

      {/* New guideline check */}
      {isGuideline ? (
        <View style={styles.viewWithSpace}>
          <Text style={styles.guidelineText}>
            Does this supersede an old guideline?
          </Text>
          <Switch
            value={supersedingGuideline === null ? false : true}
            onValueChange={(value) => handleSupersedeChange(value)}
            color={theme.colors.primary}
          />
        </View>
      ) : (
        <></>
      )}

      {/* Preceding guideline picker */}
      <Portal>
        <GuideLinePickerDialog
          visible={guidelinePicker}
          onDismiss={() => {
            setSupersedingGuideline(null);
            setGuidelinePicker(false);
          }}
          onSelect={handlePostPress}
        ></GuideLinePickerDialog>
      </Portal>

      {/* Preceding guideline view */}
      {isGuideline && supersedingGuideline != null ? (
        <View style={styles.view}>
          <Text style={styles.guidelineText}>
            This guideline will supersede:
          </Text>
          <GuidelineCard
            guideline={supersedingGuideline}
            showRemove={true}
            onRemove={() => setSupersedingGuideline(null)}
          />
        </View>
      ) : (
        <></>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  guidelineText: {
    alignSelf: "center",
    textAlign: "left",
    fontSize: 15,
    marginLeft: 4,
  },
  view: {
    margin: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  viewWithSpace: {
    margin: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
