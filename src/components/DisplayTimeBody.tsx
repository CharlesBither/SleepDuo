import { Text } from "react-native-paper"

type Props = {
    date?: Date;
  };

/** @returns a text element representing time as HH:mm, or the string 'Add' if time === -1 */
export default function DisplayTimeBody({date}: Props): JSX.Element {

  if (!date) {
    return <Text variant="bodyLarge" theme={{ colors: { onSurface: 'gray' } }}>Add</Text>
  }
  const dateString = date.toString();
  const start = dateString.indexOf(" ", 4);
  const end = dateString.indexOf(":", 1);
  const dateText = dateString.slice(start, end);

  return <Text variant="bodyLarge">{dateString}</Text>
}