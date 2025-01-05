// import { db } from "../services/firebase";
// import { collection, addDoc, doc, setDoc, getDoc, deleteDoc, updateDoc, getDocs, runTransaction  } from 'firebase/firestore'
// import Toast from "react-native-toast-message";
// import { useCallback } from "react";

// export const useFirestore = () => {

//     const addToWatchlist = async (userId, dataId, data) => {
//         if (await checkIfInWatchlist(userId, dataId)){
//             Toast.show({
//                 type: "info",
//                 text1: "Info",
//                 text2: "Already in watchlist",
//                 position: "top",
//             });

//             return false;
//         }
//         try{
//             await setDoc(doc(db, "users", userId, "watchlist", dataId), data);
//             await addRatingToAverage(dataId, data.user_rating);
//             Toast.show({
//                 text1: "Success",
//                 text2: "Added to watchlist",
//                 type: "success",
//                 position: "top",
//             });
//         } catch (error) {
//             console.log(error, "error")
//             Toast.show({
//                 text1: "Error",
//                 text2: "Error while adding to watchlist",
//                 type: "error",
//                 position: "top",
//             });
//         }
//     };

//     const checkIfInWatchlist = async (userId, dataId) => {
//         const docRef = doc(db, "users", userId?.toString(), "watchlist", dataId?.toString());
    
//         const docSnap = await getDoc(docRef);
    
//         if (docSnap.exists()){
//             return true;
//         } else {
//             false;
//         }
//     }

//     const removeFromWatchlist = async (userId, dataId) => {
//         try {
//             const watchlistRef = doc(db, "users", userId, "watchlist", dataId);
//             const docSnap = await getDoc(watchlistRef);

//             if (docSnap.exists()) {
//                 const userRating = docSnap.data().user_rating;
//                 await removeRatingFromAverage(dataId, userRating);
//                 await deleteDoc(watchlistRef);
//             }
//             Toast.show({
//                 text1: "Success",
//                 text2: "Removed from watchlist",
//                 type: "success",
//                 position: "top",
//             });
//         } catch(error) {
//             console.log(error, "error")
//             Toast.show({
//                 text1: "Error",
//                 text2: "Error while deleting from watchlist",
//                 type: "error",
//                 position: "top",
//             });
//         }
//     }

//     const updateWatchlist = async (userId, dataId, updatedData) => {
//         try {
//             const watchlistRef = doc(db, "users", userId, "watchlist", dataId);
//             const docSnap = await getDoc(watchlistRef);

//             if (docSnap.exists()) {
//                 const oldRating = docSnap.data().user_rating;
//                 const newRating = updatedData.user_rating;

//                 await updateRatingInAverage(dataId, oldRating, newRating);
//                 await updateDoc(watchlistRef, updatedData);
//             }
    
//             Toast.show({
//                 text1: "Success",
//                 text2: "Updated item in watchlist",
//                 type: "success",
//                 position: "top",
//             });
//         } catch (error) {
//             console.error("error", error);
    
//             Toast.show({
//                 text1: "Error",
//                 text2: "Error while updating item in watchlist",
//                 type: "error",
//                 position: "top",
//             });
//         }
//     };

//     const fetchWatchlistElement = async (userId, dataId) => {
//         try {
//             const docRef = doc(db, "users", userId, "watchlist", dataId);
//             const docSnapshot = await getDoc(docRef);
    
//             if (docSnapshot.exists()) {
//                 return docSnapshot.data();
//             } else {
//                 console.log("No document for this movie/show");
//                 return null;
//             }
//         } catch (error) {
//             console.error("Error fetching review and rating", error);
//             Toast.show({
//                 text1: "Error",
//                 text2: "Error while fetching item data",
//                 type: "error",
//                 position: "top",
//             });
//         }
//     };

//     const getWatchlist = useCallback(async (userId) => {
//         const querySnapshot = await getDocs(
//           collection(db, "users", userId, "watchlist")
//         );
//         const data = querySnapshot.docs.map((doc) => ({
//           ...doc.data(),
//         }));
//         return data;
//     }, []);

//     const addRatingToAverage = async (dataId, rating) => {
//         const ratingsRef = doc(db, "ratings", dataId);
//         const ratingsDoc = await getDoc(ratingsRef);

//         let averageRating = 0;
//         let totalRatings = 0;

//         if (ratingsDoc.exists()) {
//             averageRating = ratingsDoc.data().averageRating;
//             totalRatings = ratingsDoc.data().totalRatings;
//         }

//         totalRatings += 1;
//         averageRating = (averageRating * (totalRatings - 1) + rating) / totalRatings;

//         await setDoc(ratingsRef, { averageRating, totalRatings }, { merge: true });
//     };

//     const removeRatingFromAverage = async (dataId, rating) => {
//         const ratingsRef = doc(db, "ratings", dataId);
//         const ratingsDoc = await getDoc(ratingsRef);

//         let averageRating = 0;
//         let totalRatings = 0;

//         if (ratingsDoc.exists()) {
//             averageRating = ratingsDoc.data().averageRating;
//             totalRatings = ratingsDoc.data().totalRatings;
//         }

//         if (totalRatings > 1) {
//             averageRating = (averageRating * totalRatings - rating) / (totalRatings - 1);
//             totalRatings -= 1;
//         } else {
//             averageRating = 0;
//             totalRatings = 0;
//         }

//         await setDoc(ratingsRef, { averageRating, totalRatings }, { merge: true });
//     };

//     const updateRatingInAverage = async (dataId, oldRating, newRating) => {
//         const ratingsRef = doc(db, "ratings", dataId);
//         const ratingsDoc = await getDoc(ratingsRef);

//         let averageRating = 0;
//         let totalRatings = 0;

//         if (ratingsDoc.exists()) {
//             averageRating = ratingsDoc.data().averageRating;
//             totalRatings = ratingsDoc.data().totalRatings;
//         }

//         averageRating = (averageRating * totalRatings - oldRating + newRating) / totalRatings;

//         await setDoc(ratingsRef, { averageRating, totalRatings }, { merge: true });
//     };

//     const fetchAverageRating = async (dataId) => {
//         try {
//             const docRef = doc(db, "ratings", dataId);
//             const docSnapshot = await getDoc(docRef);
    
//             if (docSnapshot.exists()) {
//                 return docSnapshot.data();
//             } else {
//                 console.log("No document for this movie/show");
//                 return null;
//             }
//         } catch (error) {
//             console.error("Error fetching average rating", error);
//             Toast.show({
//                 text1: "Error",
//                 text2: "Error while fetching average rating",
//                 type: "error",
//                 position: "top",
//             });
//         }
//     };

//     return {
//         addToWatchlist,
//         checkIfInWatchlist,
//         removeFromWatchlist,
//         updateWatchlist,
//         fetchWatchlistElement,
//         getWatchlist,
//         fetchAverageRating
//     };
// };