import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Używamy ikon z expo

export default function StarRating({ rating, setRating, count = 5, size = 28 }) {
  const [hover, setHover] = useState(null);

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {[...Array(count)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <TouchableOpacity
            key={index}
            onPress={() => setRating(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(null)}
          >
            <Ionicons
              name="star"
              size={size}
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              style={{ marginHorizontal: 2 }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
