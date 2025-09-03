import { Consumable } from "@/src/types/Consumable";
import { SleepRecordFilter } from "@/src/types/SleepRecordFilter";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Modal, Portal, RadioButton, Button, useTheme } from "react-native-paper";

type ExploreModalProps = {
  activity: SleepRecordFilter | "";
  visible: boolean;
  setActivity: React.Dispatch<React.SetStateAction<"" | Consumable>>;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ExploreModal(props: ExploreModalProps) {
  const theme = useTheme();
  const containerStyle = {
    ...styles.container,
    backgroundColor: theme.colors.elevation.level2,
  };

  const [value, setValue] = useState(props.activity);

  const handleSavePress = (): void => {
    props.setActivity(value);
    props.setVisible(false);
  }

  const handleCancelPress = (): void => {
    setValue(props.activity);
    props.setVisible(false);
  }

  const handleValueChange = (newValue: string): void => {
    if (newValue === "alcohol" || newValue === "caffiene" || newValue === "") {
      setValue(newValue);
    }
  }

  return (
    <Portal>
      <Modal
        visible={props.visible}
        onDismiss={() => props.setVisible(false)}
        contentContainerStyle={containerStyle}
      >
        <RadioButton.Group
          onValueChange={(newValue) => handleValueChange(newValue)}
          value={value}
        >

          <RadioButton.Item label="Alcohol" value="alcohol" style={{backgroundColor: theme.colors.elevation.level2}} />
          <RadioButton.Item label="Caffiene" value="caffiene" style={{backgroundColor: theme.colors.elevation.level2}} />
        </RadioButton.Group>
        <View style={styles.buttonContainer}>
          <View style={{flex: 1}}></View>
          <Button onPress={handleCancelPress} mode="outlined" style={styles.button}>Cancel</Button>
          <Button onPress={handleSavePress} mode="contained" style={styles.button}>Save</Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    marginHorizontal: 20,
    borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    marginRight: 10,
    marginTop: 20,
  }
});
