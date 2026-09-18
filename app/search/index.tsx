import { StyleSheet, View } from "react-native";

import { Header } from "@/components/layout/header";
import { EmptyState } from "@/components/ui/empty_state";
import { Colors } from "@/constants/colors";

/**
 * Search screen — placeholder shell so this route has a valid default
 * export (an empty file here crashes the whole app's navigator on
 * boot). The real search UI/logic is a separate member's scope; swap
 * this body out once that's built — the Header + navigation wiring
 * can stay as-is.
 */
export default function SearchScreen() {
  return (
    <View style={styles.screen}>
      <Header title="Search" />
      <EmptyState
        icon="search-outline"
        title="Search is on its way"
        hint="Song, artist and playlist search will show up here."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
});
