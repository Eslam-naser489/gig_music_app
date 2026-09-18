import { Redirect } from "expo-router";

/**
 * Orphaned route from an earlier auth-screen draft (superseded by
 * onboarding.tsx -> login.tsx). Kept as a redirect, not deleted,
 * because Expo Router still registers this file as a screen and an
 * empty file with no default export crashes the whole app's
 * navigator on boot — this just sends anyone who lands here to the
 * real login screen.
 */
export default function SignIn() {
  return <Redirect href="/(auth)/login" />;
}
