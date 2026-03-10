import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "PRODUCT_STORE";

export const loadProducts = async () => {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

export const saveProducts = async (products) => {
  await AsyncStorage.setItem(KEY, JSON.stringify(products));
};