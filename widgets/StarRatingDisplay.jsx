import React from "react";
import { View, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function StarRatingDisplay({ rating, setRating, size = 5, textSize = 28 }) {
  return (
    <View style={{ position: "relative", width: size, height: size, transform: [ { translateY: -4 }], }}>
      {/* Ikona gwiazdy */}
      <Ionicons name="star" size={size} color="#ffc107" style={{ position: "absolute" }} />
      {/* Tekst wewnątrz gwiazdy */}
      <View
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: [{ translateX: (-textSize / 2) + (rating.toString().length == 2 ? -2 : 3) }, { translateY: (-textSize / 2)  }],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: textSize,
            fontWeight: "bold",
            color: "#333",
          }}
        >
          {rating}
        </Text>
      </View>
    </View>
  );
}
