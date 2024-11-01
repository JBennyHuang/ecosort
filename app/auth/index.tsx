import { Button, Text, View } from "react-native";

import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function AuthScreen() {
  const auth = useAuth();
  const [userInfo, setUserInfo] = useState<any>(null);

  if (auth.isSignedIn) {
    const user = jwtDecode<{ oid: string; name: string }>(auth.token);

    return (
      <View>
        <Text>Welcome {user.name}</Text>
        <Button title="Sign out" onPress={auth.signOut} />
        {userInfo && <Text>{userInfo}</Text>}
        <Button
          title="Get my profile"
          onPress={() => {
            fetch(
              `https://ecosort-backend-dev.azurewebsites.net/api/users/me`,
              {
                headers: {
                  Authorization: `Bearer ${auth.token}`,
                },
              }
            )
              .then((response) => response.text())
              .then((data) => {
                setUserInfo(data);
              })
              .catch((error) => {
                console.error(error);
              });
          }}
        />
        <Button
          title="Increase my points"
          onPress={() => {
            fetch(
              `https://ecosort-backend-dev.azurewebsites.net/api/users/me/points`,
              {
                method: "PATCH",
                headers: {
                  Authorization: `Bearer ${auth.token}`,
                },
                body: JSON.stringify({
                  points: 100,
                }),
              }
            )
              .then((response) => response.text())
              .then((data) => {
                setUserInfo(data);
              })
              .catch((error) => {
                console.error(error);
              });
          }}
        />
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
