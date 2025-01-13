import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator} from "react-native";
import { useAuth } from "../../context/useAuth";

const Profile = () => {
  const { user, login, logout, register, loading} = useAuth();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(loading);

  useEffect(() => {
    setIsLoading(true);
    if (user) {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, [user]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-800">
        <ActivityIndicator size="large" color="#FF6F61" />
        <Text className="mt-4 text-gray-300">Checking login status...</Text>
      </View>
    );
  }

  if (isLoggedIn && user) {
    return (
      <View className="flex-1 bg-gray-900 px-4 pt-4">
        <View className="bg-gray-700 rounded-lg p-4 mx-auto max-w-sm shadow-lg">
          <Text className="text-lg font-semibold text-gray-100">
            Hello, {user.email}
          </Text>
        </View>
        <Pressable
          onPress={async () => {
            try {
              setIsLoading(true);
              await logout();
              setIsLoggedIn(true);
            } catch (error) {
              console.error("Error while logging out:", error);
            } finally {
              setIsLoading(false);
            }
          }}
          style={{
            backgroundColor: "#4A5568", // gray-600
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ color: "#E2E8F0", fontSize: 16, fontWeight: "600" }}>
            Log Out
          </Text>
        </Pressable>
        <View className="mt-8">
          {/* TODO */}
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-gray-900 px-4">
      {isRegistering ? (
        <Pressable className="flex-1 w-full justify-center items-center">
          <View className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
            <Text className="text-2xl font-bold mb-4 text-center text-gray-100">Register</Text>
            <TextInput
              className="w-full p-3 border border-gray-600 rounded-lg mb-4 bg-gray-800 text-gray-300"
              placeholder="Name"
              placeholderTextColor="#A0AEC0"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              className="w-full p-3 border border-gray-600 rounded-lg mb-4 bg-gray-800 text-gray-300"
              placeholder="Email"
              placeholderTextColor="#A0AEC0"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
            <TextInput
              className="w-full p-3 border border-gray-600 rounded-lg mb-4 bg-gray-800 text-gray-300"
              placeholder="Password"
              placeholderTextColor="#A0AEC0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Pressable
              onPress={async () => {
                try {
                  setIsLoading(true);
                  await register(email, password);
                  setIsLoggedIn(true);
                } catch (error) {
                  console.error("Error while registering:", error);
                } finally {
                  setIsLoading(false);
                }
              }}
              style={{
                backgroundColor: '#2a4365', // blue-600
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 25,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                Sign Up
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setIsRegistering(false)}
              style={{
                backgroundColor: "#4A5568", // gray-600
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 25,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#E2E8F0", fontSize: 16, fontWeight: "600" }}>
                Go Back
              </Text>
            </Pressable>
          </View>
        </Pressable>
      ) : (
        <View className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
          <Text className="text-2xl font-bold mb-4 text-center text-gray-100">Log In</Text>
          <TextInput
            className="w-full p-3 border border-gray-600 rounded-lg mb-4 bg-gray-800 text-gray-300"
            placeholder="Email"
            placeholderTextColor="#A0AEC0"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            className="w-full p-3 border border-gray-600 rounded-lg mb-4 bg-gray-800 text-gray-300"
            placeholder="Password"
            placeholderTextColor="#A0AEC0"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Pressable
            onPress={async () => {
              try {
                setIsLoading(true);
                await login(email, password);
                setIsLoggedIn(true);
              } catch (error) {
                console.error("Error while logging in:", error);
              } finally {
                setIsLoading(false);
              }
            }}
            style={{
              backgroundColor: '#2a4365', // blue-600
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 25,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
              Log In
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setIsRegistering(true)}
            style={{
              backgroundColor: "#4A5568", // gray-600
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 25,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#E2E8F0", fontSize: 16, fontWeight: "600" }}>
              Register
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default Profile;
