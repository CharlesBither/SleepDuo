import { StyleSheet, Pressable } from "react-native"
import { List, Divider, Text, Portal, Modal, useTheme } from "react-native-paper"
import ThemedView from "./ThemedView"
import { useState } from "react"

export default function AddActivity() {
    const theme = useTheme()
    const [visible, setVisible] = useState(false)

    const showModal = () => setVisible(true)
    const hideModal = () => setVisible(false)
    const containerStyle = { backgroundColor: theme.colors.background, padding: 20, margin: 20 };

    return (

        <ThemedView>
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} 
                contentContainerStyle={containerStyle}
                >
                    <Text>Example Modal.  Click outside this area to dismiss.</Text>
                </Modal>
            </Portal>

            <Text variant="displaySmall" style={styles.text}>Add activity</Text>
            <List.Section>
                <Divider />
                <Pressable onPress={showModal}>
                    <List.Item title="Activity Type"
                        right={() => <Text variant="bodyLarge" theme={{ colors: { onSurface: 'gray' } }}>Add</Text>}
                    />
                </Pressable>
                <Divider />
                <List.Item title="Start"
                    right={() => <Text variant="bodyLarge" theme={{ colors: { onSurface: 'gray' } }}>Add</Text>}
                />
                <List.Item title="Duration"
                    right={() => <Text variant="bodyLarge">30 min</Text>}
                />
            </List.Section>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    text: {
        marginLeft: 15,
    },
    // modalView: {
    //     margin: 20,
    //     borderRadius: 20,
    //     padding: 35,
    //     alignItems: 'center',
    //     shadowColor: '#000',
    //     shadowOffset: {
    //         width: 0,
    //         height: 2,
    //     },
    //     shadowOpacity: 0.25,
    //     shadowRadius: 4,
    //     elevation: 5,
    // },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
})