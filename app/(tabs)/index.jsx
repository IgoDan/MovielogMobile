import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Pressable } from 'react-native';
import CardComponent from '../../components/CardComponent';
import { fetchTrending } from '../../services/api';

const index = () => {
  const [data, setData] = useState([]);
  const [timeWindow, setTimeWindow] = useState('day');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrending(timeWindow)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [timeWindow]);

  return (
    <View className="flex-1 bg-gray-900 px-4 py-6">

      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-bold text-white uppercase">Trending</Text>
        <View className="flex-row items-center border border-gray-500 rounded-full">
          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${
              timeWindow === 'day' ? 'bg-gray-700' : ''
            }`}
            onPress={() => setTimeWindow('day')}
          >
            <Text className="text-white">Day</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${
              timeWindow === 'week' ? 'bg-gray-700' : ''
            }`}
            onPress={() => setTimeWindow('week')}
          >
            <Text className="text-white">Week</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#63b3ed" />
      ) : (
        <FlatList
          data={data}
          numColumns={1}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
              <CardComponent key={item.id} item={item} type={item.media_type} />
          )}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        />
      )}
    </View>
  );
};

export default index;