import { Stack, router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { loadProducts, saveProducts } from "../storage/storage";

export default function App() {

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");

  useFocusEffect(
    useCallback(() => {
      loadProducts().then(setProducts);
    }, [])
  );

  const addProduct = async () => {

    if (!productName || !price) return;

    const newProduct = {
      id: Date.now().toString(),
      name: productName,
      suppliers: [
        {
          id: Date.now().toString() + "s",
          name: "Thúy Lệ",
          price: Number(price)
        }
      ]
    };

    const newData = [...products, newProduct];

    setProducts(newData);
    await saveProducts(newData);

    setModalVisible(false);
    setProductName("");
    setPrice("");
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Stack.Screen options={{ title: "Quản lý sản phẩm" }} />

      <View style={styles.container}>

        <View style={styles.header}>

          <TextInput
            placeholder="Tìm sản phẩm..."
            value={search}
            onChangeText={setSearch}
            style={styles.search}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addText}>＋</Text>
          </TouchableOpacity>

        </View>

        <ScrollView>

          {filtered.map((item) => (

            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => router.push(`/product/${item.id}`)}
            >
              <Text style={styles.productName}>
                {item.name}
              </Text>
            </TouchableOpacity>

          ))}

        </ScrollView>

      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
      >

        <View style={styles.modalOverlay}>

          <View style={styles.modalBox}>

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Thêm sản phẩm
              </Text>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeText}>❌</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Tên sản phẩm"
              value={productName}
              onChangeText={setProductName}
              style={styles.input}
            />

            <TextInput
              placeholder="Giá nhập"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              style={styles.input}
            />

            <Text style={{ marginBottom: 10, fontSize: 18 }}>
              Mặc định thêm mới: <Text style={{ fontWeight: "bold" }}>Thúy Lệ</Text>
            </Text>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={addProduct}
            >
              <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>Lưu</Text>
            </TouchableOpacity>

          </View>

        </View>

      </Modal>
    </>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5"
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15
  },

  search: {
    flex: 1,
    marginEnd: 5,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd"
  },

  addButton: {
    width: 40,
    height: 40,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },

  addText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold"
  },

  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },

  productName: {
    fontSize: 18,
    fontWeight: "500"
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center"
  },

  modalBox: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold"
  },

  closeText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold"
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16
  },

  saveBtn: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 8,
    alignItems: "center"
  }
});