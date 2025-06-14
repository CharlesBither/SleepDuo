import { Text } from "react-native-paper"

type Props = {
    time: number;
  };

/** @returns a text element representing time as HH:mm, or the string 'Add' if time === -1 */
export default function DisplayTimeBody({time}: Props): JSX.Element {

  if (time === -1) {
    return <Text variant="bodyLarge" theme={{ colors: { onSurface: 'gray' } }}>Add</Text>
  }
  const hours = Math.floor(time / 60);
  const minutes = time % 60;

  return <Text variant="bodyLarge">{hours}:{minutes}</Text>
}