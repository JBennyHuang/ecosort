"use client"

import { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Button } from "react-native";


export default function LoginLayout() {

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");


  return (
    <>
      <View style={styles.viewStyle}>

        <Text style={styles.titleStyle}>
          Login
        </Text>

        <View style={styles.inputViewStyle}>
          <TextInput
            style={styles.inputTextStyle}
            placeholder="Email"
            placeholderTextColor={"grey"}
            onChangeText={(e) => setEmail(e)}
          />
        </View>

        <View style={styles.inputViewStyle}>
          <TextInput
            style={styles.inputTextStyle}
            placeholder="Password"
            placeholderTextColor={"grey"}
            secureTextEntry
            onChangeText={(e) => setPass(e)}
          />
        </View>

        <TouchableOpacity
          id="Submit"
          style={styles.touchableStyle}
          onPress={() => { }}
        >
          <Text style={styles.textStyle}>
            Submit
          </Text>
        </TouchableOpacity>

        <Button
          title="Dont have an account? Register Now"
          onPress={() => { }}
        />

        {/* <Text style={styles.textStyle}>Sign in with Google</Text> */}
        <TouchableOpacity
          id="Sign in with Google"
          style={styles.touchableGoogleStyle}
          onPress={() => { }}
        >
          <Text style={styles.textStyle}>
            Sign in with Google
          </Text>
        </TouchableOpacity>

      </View>
    </>
  );

}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "pink"
  },
  inputViewStyle: {
    width: "75%",
    height: 50,
    padding: 20,
    margin: 10,
    borderRadius: 10,
    justifyContent: "center",
    backgroundColor: "white"
  },
  inputTextStyle: {
    height: 20,
    fontSize: 20,
    color: "black",

  },
  textStyle: {
    height: 40,
    padding: 10,
    fontSize: 20,
  },
  titleStyle: {
    height: 50,
    fontSize: 32,
    margin: 10,
    fontWeight: "bold",
  },
  touchableStyle: {
    width: "50%",
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "grey",
    margin: 10,
  },
  touchableGoogleStyle: {
    width: "75%",
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    margin: 10,
  },
});