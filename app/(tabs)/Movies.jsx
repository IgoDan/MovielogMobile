import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { fetchMovies, searchMovies } from "../../services/api";
import CardComponent from "../../components/CardComponent";
import PagingComponent from "../../components/PaginingComponent";
import { generateYearOptions } from "../../utils/helper";
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from "react-native-vector-icons/Ionicons";

export default function Movies() {

  const [movies, setMovies] = useState([]);

  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [sortBy, setSortBy] = useState("vote_average.desc&vote_count.gte=500");
  const [searchValue, setSearchValue] = useState("");
  const [releaseYear, setReleaseYear] = useState(1);

  const [isLoading, setIsLoading] = useState(true);

  const RefreshNonSearch = () => {
    setIsLoading(true);
    fetchMovies(activePage, sortBy, releaseYear).then((res) => {
      //console.log(res, 'res')
      setMovies(res?.results);
      setTotalPages(res?.total_pages);
    })
      .catch((err) => console.log(err, 'err'))
      .finally((() => setIsLoading(false)))
  }

  const RefreshWithSearch = () => {
    setIsLoading(true);
    searchMovies(searchValue, activePage, releaseYear).then((res) => {
      //console.log(res, 'res')
      setMovies(res?.results);
      setTotalPages(res?.total_pages);
    }).catch((err) => {
      console.log(err, 'err')
    }).finally(() => setIsLoading(false))
  }

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchValue === "") {
      RefreshNonSearch();
    }
    else {
      RefreshWithSearch();
    }
    setActivePage(1);
  }

  useEffect(() => {
    if (searchValue === "") {
      RefreshNonSearch()
    }
    else {
      RefreshWithSearch()
    }
  }, [activePage, sortBy, releaseYear])

  return (
    <View className="flex-1 bg-gray-900 px-4 py-4">
      <View className="flex-column items-center px-4">

        <View className="flex-row items-center justify-between mb-4 gap-8">
          <Text className="text-lg font-bold text-white uppercase">Search movies</Text>
        </View>

        <View className="flex-row mb-4 gap-4">
          <TextInput
            className="flex-1 bg-gray-800 text-white text-base px-4 py-2 rounded-md"
            style={{ height: 45 }}
            placeholder="Search movies..."
            placeholderTextColor="gray"
            value={searchValue}
            onChangeText={setSearchValue}
            onSubmitEditing={handleSearch}
          />

          <TouchableOpacity
            className="ml-2 bg-blue-700 px-4 py-2.5 rounded-md"
            style={{ height: 45, width: 90 }}
            onPress={handleSearch}
          >
            <Text className="text-white text-base font-bold text-center">Search</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center items-center">
          <RNPickerSelect
            onValueChange={(value) => setSortBy(value)}
            items={[
              { label: "Top Rated", value: "vote_average.desc&vote_count.gte=500" },
              { label: "Popular", value: "popularity.desc" },
            ]}
            value={sortBy}
            useNativeAndroidPickerStyle={false}
            style={{
              inputAndroid: {
                backgroundColor: "#1f2937",
                color: "#ffffff",
                fontSize: 16,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                borderColor: "#4b5563",
                borderWidth: 1,
                height: 45,
                width: 162,
              },
              iconContainer: {
                top: 14,
                right: 12,
              },
            }}
            placeholder={{
              label: "Sort By...",
              value: null,
              color: "#3182ce",
            }}
            Icon={() => <Ionicons name="chevron-down" size={20} color="#ffffff" />}
          />

          <View style={{ width: 22 }} />

          <RNPickerSelect
            onValueChange={(value) => {
              setReleaseYear(value);
            }}
            items={[
              { label: "All years", value: 1 },
              ...generateYearOptions().map((year) => ({
                label: year.toString(),
                value: year,
              })),
            ]}
            value={releaseYear}
            useNativeAndroidPickerStyle={false}
            style={{
              inputAndroid: {
                backgroundColor: "#1f2937",
                color: "#ffffff",
                fontSize: 16,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                borderColor: "#4b5563",
                borderWidth: 1,
                height: 45,
                width: 162,
              },
              iconContainer: {
                top: 14,
                right: 12,
              },
            }}
            placeholder={{
              label: "Choose Release Year...",
              value: null,
              color: "#3182ce",
            }}
            Icon={() => {
              return <Ionicons name="chevron-down" size={20} color="#ffffff" />;
            }}
          />
        </View>
        
        {movies.length > 0 && (
        <View className="flex-row justify-center items-center mb-4">
          <PagingComponent
            activePage={activePage}
            totalPages={totalPages}
            setActivePage={setActivePage}> 
          </PagingComponent>
        </View>
        )}

        {isLoading ? (
          <ActivityIndicator size="large" color="#63b3ed" />
        ) : (
          <FlatList
            data={movies}
            numColumns={1}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <CardComponent key={item?.id} item={item} type={"movie"} />
            )}
            contentContainerStyle={{
              paddingBottom: 220,
            }}
          />
        )}
      </View>
    </View >
  );
}