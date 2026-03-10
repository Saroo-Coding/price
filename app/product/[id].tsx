import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { loadProducts, saveProducts } from "../../storage/storage";
import { formatPrice } from "../../utils/format";

export default function ProductDetail() {

    const { id } = useLocalSearchParams();

    const [product, setProduct] = useState(null);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    const [modalVisible, setModalVisible] = useState(false);

    const load = async () => {
        const data = await loadProducts();
        const p = data.find(i => i.id === id);

        if (p) {
            p.suppliers.sort((a, b) => a.price - b.price);
            setProduct(p);
        }
    };

    useEffect(() => { load() }, []);

    const addSupplier = async () => {
        if (!name || !price) return;

        const data = await loadProducts();
        const p = data.find(i => i.id === id);

        p.suppliers.push({
            id: Date.now().toString(),
            name,
            price: Number(price)
        });

        await saveProducts(data);
        load();

        setName("");
        setPrice("");
        setModalVisible(false);

    };

    const updatePrice = async (sid, newPrice) => {

        const price = Number(newPrice.replace(/\./g, ""));

        const data = await loadProducts();
        const p = data.find(i => i.id === id);

        const s = p.suppliers.find(i => i.id === sid);
        s.price = price;

        await saveProducts(data);
        load();
    };

    const deleteSupplier = async (sid) => {
        const data = await loadProducts();
        const p = data.find(i => i.id === id);

        p.suppliers = p.suppliers.filter(i => i.id !== sid);

        await saveProducts(data);
        load();
    };

    const deleteProduct = async () => {
        Alert.alert(
            "Xóa sản phẩm",
            "Bạn có chắc muốn xóa sản phẩm này?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {

                        const data = await loadProducts();
                        const newData = data.filter(i => i.id !== id);

                        await saveProducts(newData);

                        router.back();
                    }
                }
            ]
        );
    };

    if (!product) return null;

    const cheapest = product.suppliers[0]?.id;

    return (
        <>
            <Stack.Screen options={{ title: "Nhà cung cấp" }} />

            <View style={styles.container}>

                <View style={styles.headerRow}>

                    <Text style={styles.productName}>
                        {product.name}
                    </Text>

                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.addText}>＋</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={deleteProduct}
                    >
                        <Text style={styles.deleteText}>Xoá</Text>
                    </TouchableOpacity>

                </View>

                <ScrollView>

                    {product.suppliers.map(s => (

                        <View
                            key={s.id}
                            style={[
                                styles.card,
                                s.id === cheapest && styles.cheapest
                            ]}
                        >

                            <Text style={styles.supplier}>
                                {s.name}
                            </Text>

                            <TextInput
                                defaultValue={formatPrice(s.price)}
                                keyboardType="numeric"
                                style={styles.price}
                                onEndEditing={(e) =>
                                    updatePrice(s.id, e.nativeEvent.text)
                                }
                            />

                            <TouchableOpacity
                                onPress={() => deleteSupplier(s.id)}
                            >
                                <Text style={styles.delete}>🗑</Text>
                            </TouchableOpacity>

                        </View>

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
                                Thêm nhà cung cấp
                            </Text>

                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.closeText}>❌</Text>
                            </TouchableOpacity>

                        </View>

                        <TextInput
                            placeholder="Nhà cung cấp"
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                        />

                        <TextInput
                            placeholder="Giá"
                            value={price}
                            onChangeText={setPrice}
                            keyboardType="numeric"
                            style={styles.input}
                        />

                        <TouchableOpacity
                            style={styles.saveBtn}
                            onPress={addSupplier}
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

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15
    },

    productName: {
        flex: 1,
        fontSize: 22,
        fontWeight: "bold"
    },

    addButton: {
        width: 40,
        height: 40,
        backgroundColor: "#4CAF50",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10
    },

    addText: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold"
    },

    deleteButton: {
        width: 50,
        height: 40,
        backgroundColor: "#ff3b30",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center"
    },

    deleteText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 18
    },

    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3
    },

    cheapest: {
        borderWidth: 2,
        borderColor: "#4CAF50"
    },

    supplier: {
        flex: 1,
        fontSize: 16
    },

    price: {
        width: 80,
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 5,
        marginRight: 10,
        borderRadius: 6
    },

    delete: {
        color: "red",
        fontWeight: "bold"
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
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15
    },

    modalTitle: {
        fontSize: 20,
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
    },

    closeText: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold"
    },

});
