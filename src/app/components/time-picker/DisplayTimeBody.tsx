import { Text } from "react-native-paper"

type Props = {
    hours: number;
    minutes: number
  };

export default function DisplayTimeBody({hours, minutes}: Props) {

    return hours != -1 ? <Text variant="bodyLarge">{hours}:{minutes}</Text> : <Text variant="bodyLarge" theme={{ colors: { onSurface: 'gray' } }}>Add</Text>
}