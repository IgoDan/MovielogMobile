import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { fetchDetails, fetchCredits, imagePath, imagePathOriginal } from "../../services/api";
import { LinearGradient } from 'expo-linear-gradient'
import { ratingToPercentage, averageRatingFormat, resolveRatingColor, createId } from "../../utils/helper";
import StarRating from "../../widgets/StarRating";
import CircularProgress from 'react-native-circular-progress-indicator'
import auth from "../../services/firebase";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";


export default function Details() {

  const { type, id } = useLocalSearchParams();

  // const {
  //   addToWatchlist,
  //   checkIfInWatchlist,
  //   removeFromWatchlist,
  //   updateWatchlist,
  //   fetchWatchlistElement,
  //   fetchAverageRating,
  // } = useFirestore();

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({});
  const [cast, setCast] = useState([]);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [initialRating, setInitialRating] = useState(0);
  const [initialReview, setInitialReview] = useState("");
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [detailsData, creditsData] = await Promise.all([
          fetchDetails(type, id),
          fetchCredits(type, id),
        ]);

        setDetails(detailsData);
        setCast(creditsData?.cast?.slice(0, 10));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, id]);

  useEffect(() => {
    setReview(user.uid ? user.uid : "AAAAAAAAAAAAA");
    if (!user) {
      setIsInWatchlist(false);
      return;
    }

    const dataId = createId(id, type);
    checkIfInWatchlist(user?.uid, dataId).then(setIsInWatchlist);

    fetchWatchlistElement(user?.uid, dataId).then((watchlistElement) => {
      if (watchlistElement) {
        setInitialRating(watchlistElement.user_rating);
        setInitialReview(watchlistElement.user_review);
        setRating(watchlistElement.user_rating);
        setReview(watchlistElement.user_review);
      }
    });

    fetchAverageRating(dataId).then((averageRatingData) => {
      if (averageRatingData) {
        setAverageRating(averageRatingData.averageRating);
      }
    });
  }, [id, user]);

  // useEffect(() => {
  //   if (rating !== initialRating || review !== initialReview) {
  //     setIsUpdated(true);
  //   }
  // }, [review, rating]);

  // const handleSaveToWatchlist = async () => {
  //   if (!user) {
  //     alert("Login to add to watchlist");
  //     return;
  //   }

  //   const data = {
  //     id: details?.id,
  //     title: details?.title || details?.name,
  //     type: type,
  //     poster_path: details?.poster_path,
  //     release_date: details?.release_date || details?.first_air_date,
  //     vote_average: details?.vote_average,
  //     user_rating: rating,
  //     user_review: review,
  //   };

  //   const dataId = createId(details?.id, type);
  //   await addToWatchlist(user?.uid, dataId, data);
  //   setIsInWatchlist(await checkIfInWatchlist(user?.uid, dataId));
  //   setIsUpdated(false);
  // };

  // const handleRemoveFromWatchlist = async () => {
  //   const dataId = createId(details?.id, type);
  //   await removeFromWatchlist(user?.uid, dataId);
  //   setIsInWatchlist(await checkIfInWatchlist(user?.uid, dataId));
  //   setInitialRating(0);
  //   setInitialReview("");
  //   setRating(0);
  //   setReview("");
  // };

  // const handleUpdateWatchlist = async () => {
  //   const dataId = createId(details?.id, type);

  //   const updatedData = {
  //     user_rating: rating,
  //     user_review: review,
  //   };

  //   await updateWatchlist(user?.uid, dataId, updatedData);
  //   setInitialRating(rating);
  //   setInitialReview(review);
  //   setIsUpdated(false);
  // };

  const title = details?.title || details?.name;
  const releaseDate = type === "movie" ? details?.release_date : details?.first_air_date;

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#63b3ed" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <View className="container px-4 py-2 flex flex-col items-center my-2">
        <Image
          source={{ uri: `${imagePath}/${details?.poster_path}` }}
          style={{ height: 450, borderRadius: 6 }}
          className="w-80"
        />
        <View className="flex-1 items-center my-4">
          <Text className="text-2xl font-bold text-white">
            {title}{" "}
            <Text className="text-gray-400 font-normal">
              ({new Date(releaseDate).getFullYear()})
            </Text>
          </Text>

          <View className="flex flex-row items-center gap-2 my-2">

            <View className="flex flex-row items-center">
              <Ionicons name="calendar" size={16} color="gray" />
              <Text className="text-sm text-white ml-2">
                {new Date(releaseDate).toLocaleDateString("en-GB")}
              </Text>
            </View>

            {type === "movie" && (
              <View className="flex flex-row items-center">
                <Ionicons name="time" size={16} color="gray" />
                <Text className="text-sm text-white ml-2">
                  {details?.runtime} min
                </Text>
              </View>
            )}
          </View>

          <View className="flex flex-col gap-2 mt-2 items-center">

            <View className="flex flex-row mb-6">
              <View className="flex items-center ml-4 mr-4">
                <CircularProgress
                  //{ratingToPercentage(details?.vote_average)}
                  value={50}
                  radius={35}
                  duration={200}
                  progressValueColor={'#ecf0f1'}
                  maxValue={100}
                  titleColor={'white'}
                  titleStyle={{fontWeight: 'bold'}}
                  valueSuffix={'%'}
                  activeStrokeColor={'#0284c7'}
                  activeStrokeSecondaryColor={'#082f49'}
                />
                <Text className="text-white mt-2 font-bold">TMDB</Text>
              </View>

              <View className="flex items-center ml-4 mr-4">
                <CircularProgress
                  //{averageRating / 10}
                  value={5}
                  radius={35}
                  duration={100}
                  progressValueColor={'#ecf0f1'}
                  maxValue={10}
                  titleColor={'white'}
                  titleStyle={{fontWeight: 'bold'}}
                  progressFormatter={(value) => {
                    'worklet';                   
                    return value.toFixed(1);
                  }}
                  activeStrokeColor={'#0284c7'}
                  activeStrokeSecondaryColor={'#082f49'}
                />
                <Text className="text-white mt-2 font-bold">MOVIELOG</Text>
              </View>
            </View>

            <View className="flex flex-column items-center gap-3 mb-4">
              <StarRating rating={rating} setRating={setRating} count={10} />
              <Text className="text-white font-bold">MY SCORE</Text>
            </View>

            <TextInput
              className="bg-gray-800 text-white px-4 rounded-md w-80 my-5"
              multiline={true}
              numberOfLines={5}
              placeholder="Write your review..."
              placeholderTextColor="gray"
              value={review}
              onChangeText={setReview}
            />

            {isInWatchlist && !isUpdated && (
              <TouchableOpacity
                className="bg-green-600 p-2 rounded-md flex flex-row items-center"
              //onPress={handleRemoveFromWatchlist}
              >
                <Ionicons name="checkmark-circle" size={20} color="white" />
                <Text className="text-white ml-2">In watchlist</Text>
              </TouchableOpacity>
            )}
            {!isInWatchlist && (
              <TouchableOpacity
                className="border border-white p-2 rounded-md flex flex-row items-center"
              //onPress={handleSaveToWatchlist}
              >
                <Ionicons name="add-circle" size={25} color="white" />
                <Text className="text-white ml-2">Add to watchlist</Text>
              </TouchableOpacity>
            )}
            {isInWatchlist && isUpdated && (
              <TouchableOpacity
                className="border border-blue-600 p-2 rounded-md flex flex-row items-center"
              //onPress={handleUpdateWatchlist}
              >
                <Ionicons name="refresh-circle" size={20} color="blue" />
                <Text className="text-blue-600 ml-2">Update changes</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View className="flex flex-col gap-3 w-80 items-center mt-1">
          <Text className="text-lg text-gray-400 font-bold text-center">Overview</Text>
          <Text className="text-md text-gray-500 italic text-center">
            {details?.overview}
          </Text>

          <Text className="text-lg text-gray-400 font-bold text-center" >Language</Text>
          <Text className="text-md text-gray-500 italic text-center">
            {details?.spoken_languages[0]?.english_name}
          </Text>

          <Text className="text-lg text-gray-400 font-bold text-center">Genres</Text>
          <View className="flex flex-row gap-2 items-center">
            {details?.genres?.map((genre) => (
              <View
                key={genre.id}
                className="bg-gray-700 px-2 py-1 rounded-md"
              >
                <Text className="text-white text-center">{genre.name}</Text>
              </View>
            ))}
          </View>
        </View>


        
        <View className="container py-4 gap-2">
          <Text className="text-lg text-gray-400 font-bold text-center">Cast</Text>
          <ScrollView horizontal className="mt-4 flex flex-row gap-4">
            {cast?.length === 0 && <Text className="text-white">No cast found</Text>}
            {cast?.map((item) => (
              <View key={item.id} className="w-36">
                <Image
                  source={{ uri: `${imagePath}/${item?.profile_path}` }}
                  className="w-full h-40 rounded-md"
                />
                <Text className="text-center text-white mt-2 font-bold">
                  {item?.original_name}
                </Text>
                <Text className="text-center text-white">as</Text>
                <Text className="text-center text-white font-bold">
                  {item?.character}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}