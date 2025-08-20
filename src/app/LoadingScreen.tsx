import { ActivityIndicator, useTheme } from "react-native-paper";
import ThemedView from "../components/ThemedView";
import { StyleSheet } from "react-native";


export default function LoadingScreen(): JSX.Element {

    const theme = useTheme();
    return (
        <ThemedView style={{...styles.container, backgroundColor: theme.colors.background}}>
            <ActivityIndicator size="large" />
        </ThemedView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});