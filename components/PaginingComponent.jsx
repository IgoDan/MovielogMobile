import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const PagingComponent = ({ activePage, totalPages, setActivePage }) => {
  return (
    <View className="flex-row items-center justify-between mt-4 mx-4">

      <View className="flex-row space-x-2">
        <TouchableOpacity
          className={`px-4 py-2 rounded-md ${activePage === 1 ? "bg-gray-400" : "bg-blue-700"}`}
          style={{ height: 40, width: 80 }}
          onPress={() => setActivePage(activePage - 1)}
          disabled={activePage === 1}>
            <Text className="text-white text-base font-bold text-center">Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`px-4 py-2 rounded-md ${activePage === totalPages ? "bg-gray-500" : "bg-blue-700"}`}
          style={{ height: 40, width: 80 }}
          onPress={() => setActivePage(activePage + 1)}
          disabled={activePage === totalPages}>
          <Text className="text-white text-base font-bold text-center">Next</Text>
        </TouchableOpacity>
      </View>

      <View style={{ width: 16 }} />

      <View className="flex-row items-center space-x-1">
        <Text className="text-white text-base">{activePage}</Text>
        <Text className="text-white text-base">of</Text>
        <Text className="text-white text-base">{totalPages}</Text>
      </View>
    </View>
  );
};

export default PagingComponent;