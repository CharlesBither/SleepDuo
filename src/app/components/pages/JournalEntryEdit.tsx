import { StyleSheet, Pressable } from "react-native"
import { List, Divider, Text, useTheme } from "react-native-paper"
import ThemedView from "../ThemedView"
import { useState, useCallback } from "react"
import { TimePickerModal } from 'react-native-paper-dates';
import DisplayTimeBody from "../time-picker/DisplayTimeBody";
import FunctionButton from "../Button/FunctionButton";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function AddActivity() {
    const theme = useTheme()
    const router = useRouter()
    const [visible, setVisible] = useState(false)

    const onDismiss = useCallback(() => {
        setVisible(false)
    }, [setVisible])

    const onConfirm = useCallback(

        ({ hours, minutes }: { hours: number, minutes: number }) => {
            setVisible(false);
            console.log({ hours, minutes });
        },
        [setVisible]
    );

    const [drinkHours, setDrinkHours] = useState(-1)
    const [drinkMinutes, setDrinkMinutes] = useState(-1)

    return (
        <SafeAreaProvider>
            <ThemedView>
                <TimePickerModal
                    visible={visible}
                    onDismiss={onDismiss}
                    onConfirm={onConfirm}
                    animationType="none"
                />
                <Text variant="displaySmall" style={styles.text}>Add Journal Entry</Text>

                <List.Section>
                    <Divider />
                    <Pressable>
                        <List.Item title="Drinks containing alcohol"
                            right={() => <Text variant="bodyLarge" theme={{ colors: { onSurface: 'gray' } }}>Add</Text>}
                        />
                    </Pressable>
                    <List.Item title="When did you have your last drink"
                        right={() => <Pressable onPress={() => setVisible(true)}><DisplayTimeBody hours={drinkHours} minutes={drinkMinutes} /></Pressable>}
                    />
                </List.Section>
                <FunctionButton label="Go to test" func={() => router.navigate('/components/pages/Test')} />
            </ThemedView>

        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    text: {
        marginLeft: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})