import { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState([]);

  const loadTodos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("todos");
      if (jsonValue !== null) {
        setTodoList(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveTodos = async (todos) => {
    try {
      const jsonValue = JSON.stringify(todos);
      await AsyncStorage.setItem("todos", jsonValue);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAddTodo = () => {
    if (todo.trim()) {
      const newTodo = { id: Date.now().toString(), title: todo };
      const updatedTodoList = [...todoList, newTodo];
      setTodoList(updatedTodoList);
      saveTodos(updatedTodoList);
      setTodo("");
    }
  };

  const handleDeleteTodo = (id) => {
    const updatedTodoList = todoList.filter((todo) => todo.id !== id);
    setTodoList(updatedTodoList);
    saveTodos(updatedTodoList);
  };

  const renderTools = ({ item }) => (
    <View style={styles.renderTools}>
      <Text style={styles.textItem}>{item.title}</Text>
      <IconButton icon="trash-can" onPress={() => handleDeleteTodo(item.id)} />
    </View>
  );

  return (
    <View style={styles.content}>
      <Text style={styles.mainText}>Tarefas</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Add a new task"
        value={todo}
        onChangeText={(userText) => setTodo(userText)}
      />
      <TouchableOpacity style={styles.TouchableMain} onPress={handleAddTodo}>
        <Text style={styles.textButton}>Adicionar Tarefa</Text>
      </TouchableOpacity>
      <FlatList
        data={todoList}
        renderItem={renderTools}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#fff",
    padding: 20,
    flex: 1,
  },
  mainText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 35,
    marginVertical: 20,
  },
  textInput: {
    borderWidth: 2,
    borderColor: "#CCCCCC",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 20,
  },
  TouchableMain: {
    backgroundColor: "#007BFF",
    borderRadius: 50,
    paddingVertical: 12,
    marginVertical: 24,
    alignItems: "center",
  },
  textButton: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 25,
  },
  renderTools: {
    backgroundColor: "#F9F9F9",
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  textItem: {
    fontSize: 25,
    flex: 1,
    color: "#000",
    fontWeight: "400",
  },
});

export default App;
