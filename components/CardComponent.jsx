import React from 'react';
import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Link } from 'expo-router'

const imagePath = 'https://image.tmdb.org/t/p/w500';

const CardComponent = ({ item, type }) => {

  return (  
    <TouchableOpacity className="relative w-full mb-4 rounded-lg overflow-hidden">
      <Link href={`/${type}/${item?.id}`}>  
      <Image
        source={{ uri: `${imagePath}/${item?.poster_path}` }}
        style={{ height: 250 }}
        className="w-full"
        resizeMode="cover"
      />

      <View className=" w-full bg-black py-3 px-3">
        <Text className="text-white font-bold text-center text-lg" numberOfLines={1}>
          {item?.title || item?.name}
        </Text>

        <View className="flex-row items-center justify-center mt-1">
          <Text className="text-gray-400 text-sm uppercase">
            {type === 'movie' ? 'Movie' : 'TV Series'}
          </Text>
          <Text className="text-gray-400 text-sm mx-1">-</Text>
          <Text className="text-gray-400 text-sm">
            {new Date(item?.release_date || item?.first_air_date).getFullYear() || 'N/A'}
          </Text>
        </View>

        <View className="flex-row items-center justify-center mt-2">
            <Ionicons name="star" size={22} color="white"/>
          <Text className="text-white ml-1">{item?.vote_average?.toFixed(1)}</Text>
          <Text className="text-gray-400 text-xs font-bold ml-1">TMDB</Text>
        </View>

      </View>
      </Link>
    </TouchableOpacity>
  );
};

export default CardComponent;