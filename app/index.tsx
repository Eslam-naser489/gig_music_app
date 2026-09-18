import { Redirect } from "expo-router";
import { View } from "react-native";

import { Loading } from "@/components/ui/loading";
import { useAuth } from "@/context/AuthContext";
import { Colors } from "@/constants/colors";
import { Routes } from "@/constants/routes";

/**
 * App entry point — owned by the Infrastructure & Layout member.
 * Decides, once, whether the app opens on the auth flow or straight
 * into the tabs, based on whether a session is already stored.
 */
export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <Loading fullScreen />
      </View>
    );
  }

  return <Redirect href={user ? (Routes.home as any) : ("/(auth)/onboarding" as any)} />;
}
