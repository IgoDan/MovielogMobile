import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, FlatList } from "react-native";
import { useAuth } from "../../context/useAuth";
import { useFirestore } from "../../services/firestore";
import WatchlistComponent from "../../components/WatchlistComponent";
import { useFocusEffect } from "expo-router";

const Profile = () => {
  const { user, login, logout, register, loading } = useAuth();
  const { getWatchlist } = useFirestore();

  const [watchlist, setWatchlist] = useState([]);
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

  useFocusEffect(
    React.useCallback(() => {
      if (user?.uid) {
        getWatchlist(user?.uid)
          .then((data) => {
            setWatchlist(data);
            console.log(data, "data");
          })
          .catch((err) => {
            console.log(err, "error");
          })
          .finally(() => {
            setIsLoading(false);
          });
        }
    }, [user?.uid])
  );

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
        <View className="flex-row items-center justify-between bg-gray-700 rounded-lg p-3 mx-2 shadow-lg">
          <Text className="text-lg font-semibold w-60 text-gray-100">
            Hello, {user.email}
          </Text>
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
            className="bg-gray-600 py-3 px-5 rounded-md h-12 items-center justify-center"
          >
            <Text className="text-gray-200 font-semibold text-base">Log Out</Text>
          </Pressable>
        </View>
        <View className="flex-2 px-4 py-3 mx-2 my-1">
          <Text className="text-lg font-bold text-white uppercase">Watchlist</Text>
        </View>
        {isLoading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#63b3ed" />
            </View>
          ) : watchlist.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-md font-semibold text-white text-center">
                Nothing here! Add movies or shows to your watchlist.
              </Text>
            </View>
          ) : (
            <FlatList
              data={watchlist}
              keyExtractor={(item) => item?.id.toString()}
              renderItem={({ item }) => (
                <WatchlistComponent
                  key={item?.id}
                  item={item}
                  type={item?.type}
                  setWatchlist={setWatchlist}
                />
              )}
              contentContainerStyle={{
                paddingBottom: 20,
              }}
              ItemSeparatorComponent={() => <View className="h-4" />}
              className="flex-2 px-2"
            />
          )}
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-gray-900 px-4">
      {isRegistering ? (
        <Pressable className="flex-1 justify-center items-center">
          <View className=" bg-gray-800 p-6 rounded-lg shadow-lg">
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
