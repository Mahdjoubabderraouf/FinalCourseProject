import React, { useState } from "react";
import Progress_Bar from "./Progres_Bar.jsx";
import QuestionComponent from "./QuestionComponent.jsx";
import { Image } from "expo-image";
import dhakira from "../../assets/images/happyDahkira.png";
import { Questions } from "./Question.js";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

const questions = Questions;

const Test = ({ navigation }) => {
  const colors = [
    "#00E5BD",
    "#65FCE2",
    "#D292FF",
    "#EDD4FF",
    "#FFC400",
    "#FFE489",
  ];
  const step = 90 / questions.length;
  const [width, setWidth] = useState(step);
  const [colorIndex, setcolorIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [inputValue, setInputValue] = useState(""); // State to hold the input value

  function goToNextQst() {
    if (width <= 100) {
      setWidth(width + step);
      if (questionIndex < questions.length - 1) {
        setQuestionIndex(questionIndex + 1);
      } else setCompleted(true);
      setcolorIndex((colorIndex + 2) % colors.length);
    }
    if (completed) {
      navigation.navigate("Tab");
    }
    setInputValue("");
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View className="flex-1 flex justify-center box-border h-screen px-[10px]">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="bg box-border flex h-screen justify-between ">
            <Progress_Bar
              width={width}
              color={colors[colorIndex]}
              deepColor={colors[colorIndex + 1]}
            />
            {!completed && (
              <QuestionComponent
                question={questions[questionIndex].question}
                imageUri={questions[questionIndex].image}
                inputValue={inputValue}
                setInputValue={setInputValue}
                color={colors[colorIndex]}
              />
            )}
            {completed && (
              <>
                <View className="m-5 flex items-center shadow-md shadow-black">
                  <Image
                    contentFit="contain"
                    className="rounded-2xl w-[240] h-[230]"
                    source={dhakira}
                    transition={130}
                  ></Image>
                  <Text className="text-xl text-black font-bold mt-7 mb-5">
                    Thank You,{"\n"} Very Good!
                  </Text>
                </View>
              </>
            )}
            <Pressable
              onPress={goToNextQst}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: colors[colorIndex] },
                pressed && {
                  elevation: 2,
                  backgroundColor: colors[colorIndex + 1],
                },
              ]}
            >
              {({ pressed }) => {
                return (
                  <Text
                    className="text-base text-white font-bold"
                    style={[pressed && { color: colors[colorIndex] }]}
                  >
                    {completed ? "Finish" : "Submit"}
                  </Text>
                );
              }}
            </Pressable>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Test;
const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    margin: 10,
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderRadius: 10,
    elevation: 4,
  },
});
