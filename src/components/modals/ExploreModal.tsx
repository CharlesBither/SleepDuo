import { SleepSessionFilter } from "@/src/types/SleepSessionFilter";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Modal, Portal, RadioButton, Button, useTheme, ActivityIndicator } from "react-native-paper";

type ExploreModalProps = {
  activity: SleepSessionFilter | "";
  visible: boolean;
  onActivityChange: (activity: SleepSessionFilter) => Promise<void>;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ExploreModal(props: ExploreModalProps) {
  const theme = useTheme();
  const [value, setValue] = useState(props.activity);
  const [saveLoading, setSaveLoading] = useState(false);

  const handleSavePress = async (): Promise<void> => {
    if (value === "") return;
    setSaveLoading(true);
    await props.onActivityChange(value);
    setSaveLoading(false);
    props.setVisible(false);
  }

  const handleCancelPress = (): void => {
    setValue(props.activity);
    props.setVisible(false);
  }

  const handleValueChange = (newValue: string): void => {
    if (newValue === "alcohol" || newValue === "caffeine" || newValue === "") {
      setValue(newValue);
    }
  }

  return (
    <Portal>
      <Modal
        visible={props.visible}
        onDismiss={() => props.setVisible(false)}
        contentContainerStyle={{...styles.container, backgroundColor: theme.colors.elevation.level2}}
      >
        <RadioButton.Group
          onValueChange={(newValue) => handleValueChange(newValue)}
          value={value}
        >

          <RadioButton.Item label="Alcohol" value="alcohol" style={{backgroundColor: theme.colors.elevation.level2}} />
          <RadioButton.Item label="Caffeine" value="caffeine" style={{backgroundColor: theme.colors.elevation.level2}} />
        </RadioButton.Group>
        <View style={styles.buttonContainer}>
          <View style={{flex: 1}}></View>
          <Button onPress={handleCancelPress} mode="outlined" style={styles.button}>Cancel</Button>
          <Button onPress={handleSavePress} mode="contained" style={styles.button}>{saveLoading ? <ActivityIndicator color={theme.colors.inversePrimary} /> : "Save"}</Button>
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
