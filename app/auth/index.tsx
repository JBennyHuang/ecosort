import { Button, Text, View } from "react-native";

import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthScreen() {
  const auth = useAuth();

  if (auth.isSignedIn) {
    const user = jwtDecode<{ oid: string; name: string }>(auth.token);

    return (
      <View>
        <Text>Welcome {user.name}</Text>
        <Button title="Sign out" onPress={auth.signOut} />
      </View>
    );
  } else {
    return (
      <View>
        <Button title="Sign in" onPress={auth.signIn} />
      </View>
    );
  }
}
