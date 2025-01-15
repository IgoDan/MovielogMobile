import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, TextInput } from "react-native";
import CircularProgress from 'react-native-circular-progress-indicator';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFirestore } from "../services/firestore";
import { useAuth } from "../context/useAuth";
import { createId, ratingToPercentage, resolveRatingColor, averageRatingFormat } from "../utils/helper";
import StarRatingDisplay from "../widgets/StarRatingDisplay";
import { Link } from 'expo-router'
import { useFocusEffect } from "expo-router";

const WatchlistComponent = ({ item, type, setWatchlist }) => {
  const { removeFromWatchlist, checkIfInWatchlist, fetchWatchlistElement, fetchAverageRating } = useFirestore();
  const { user } = useAuth();

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [averageRating, setAverageRating] = useState(0);

  const handleRemoveClick = () => {
    const itemId = createId(item?.id, item?.type);
    removeFromWatchlist(user?.uid, itemId).then(() => {
      setWatchlist((prev) => prev.filter((el) => el.id !== item.id));
    });
  };

  useEffect(() => {
    if (!user) return;

    const dataId = createId(item?.id, type);
    checkIfInWatchlist(user?.uid, dataId);
    fetchWatchlistElement(user?.uid, dataId).then((watchlistElement) => {
      if (watchlistElement) {
        setRating(watchlistElement.user_rating);
        setReview(watchlistElement.user_review);
      }
    });
    fetchAverageRating(dataId).then((averageRatingData) => {
      if (averageRatingData) {
        setAverageRating(averageRatingData.averageRating);
      }
    });
  }, [user]);
  
  useFocusEffect(
      React.useCallback(() => {
        if (user?.uid) {
            const dataId = createId(item?.id, type);
            checkIfInWatchlist(user?.uid, dataId);
            fetchWatchlistElement(user?.uid, dataId).then((watchlistElement) => {
              if (watchlistElement) {
                setRating(watchlistElement.user_rating);
                setReview(watchlistElement.user_review);
              }
            });
            fetchAverageRating(dataId).then((averageRatingData) => {
              if (averageRatingData) {
                setAverageRating(averageRatingData.averageRating);
              }
            });
        }
      }, [user?.uid])
    );

  return (
    <Pressable className="bg-gray-800 rounded-lg flex-row">
    <Link href={`/${type}/${item?.id}`}>  
      {/* Poster and remove button */}
      <View className="relative bg-gray-800 rounded-lg flex-row">
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
          className="h-50 w-32 rounded-md"
          resizeMode="cover"
        />{/* Content */}
        <View className="flex-1 px-4 py-1">
          {/* Title and meta */}
          <View className="mb-4">
            <Text className="text-lg font-semibold text-gray-100" numberOfLines={1}>
              {item?.title || item?.name}
            </Text>
            <View className="flex-row items-center gap-1">
              <Text className="text-sm text-gray-400 uppercase">
                {item?.type === "movie" ? "Movie" : "TV Series"}
              </Text>
              <Text className="text-sm text-gray-400">-</Text>
              <Text className="text-sm text-gray-400">
                {new Date(item?.release_date || item?.first_air_date).getFullYear() || "N/A"}
              </Text>
            </View>
          </View>
  
          {/* Rating section */}
          <View className="flex-row gap-3 mb-4 px-2">
            <View className="items-center">
              <CircularProgress
                value={ratingToPercentage(item?.vote_average)}
                radius={25}
                progressValueColor="#ecf0f1"
                maxValue={100}
                valueSuffix={'%'}
                activeStrokeColor="#0284c7"
                activeStrokeSecondaryColor="#082f49"
              />
              <Text className="text-xs font-bold text-gray-200 mt-1">TMDB</Text>
            </View>
            <View className="items-center">
              <CircularProgress
                value={averageRating}
                radius={25}
                duration={100}
                progressValueColor={'#ecf0f1'}
                maxValue={10}
                titleColor={'white'}
                titleStyle={{ fontWeight: 'bold' }}
                progressFormatter={(value) => {
                  'worklet';
                  return value.toFixed(1);
                }}
                activeStrokeColor={'#0284c7'}
                activeStrokeSecondaryColor={'#082f49'}
              />
              <Text className="text-xs font-bold text-gray-200 mt-1">MOVIELOG</Text>
            </View>
            <View className="items-center">
                <StarRatingDisplay rating={rating} setRating={setRating} size={50} textSize={16}/>
              <Text className="text-xs font-bold text-gray-200 mt-1">USER</Text>
            </View>
          </View>
  
          {/* Review section */}
          <View className="mb-1.5">
            <TextInput
              value={review?.length > 20
                ? `${review.slice(0, 20)}...` 
                : review}
              editable={false}
              numberOfLines={1}
              scrollEnabled={false}
              multiline={false}
              textAlignVertical="right"
              ellipsizeMode="tail"
              placeholder="No review found"
              className="bg-gray-700 text-gray-200 text-sm rounded-md p-2"/>
          </View>
        </View>
        <Pressable
          onPress={handleRemoveClick}
          className="absolute top-2 left-2 bg-red-600 p-2 rounded-full"
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </Pressable>
      </View>
    </Link>
    </Pressable>
  );
};

export default WatchlistComponent;
