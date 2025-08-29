import { useState } from "react";
import { Button, List } from "react-native-paper";
import ExploreModal from "../components/modals/ExploreModal";
import ThemedView from "../components/ThemedView";

export default function Explore() {
  const [activity, setActivity] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  if (activity === "") {
    return (
      <ThemedView>
        <List.Section>
          <List.Subheader>Selected activity</List.Subheader>
          <List.Item
            title="None selected"
            description="Click the button to select an activity"
            right={() => (
              <Button onPress={() => setModalVisible(true)}>
                Select activity
              </Button>
            )}
          />
        </List.Section>
        <ExploreModal
          activity={activity}
          visible={modalVisible}
          setActivity={setActivity}
          setVisible={setModalVisible}
        />
      </ThemedView>
    );
  }
  return (
    <ThemedView>
      <List.Section>
        <List.Subheader>Selected activity</List.Subheader>
        <List.Item
          title={activity}
          description="Click the button to change activity"
          right={() => (
            <Button onPress={() => setModalVisible(true)}>
              Change activity
            </Button>
          )}
        />
        <ExploreModal
          activity={activity}
          visible={modalVisible}
          setActivity={setActivity}
          setVisible={setModalVisible}
        />
      </List.Section>
    </ThemedView>
  );
}
