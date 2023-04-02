import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  Pressable,
} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);


const bmiKey = '@MyApp:bmiKey';
const heightKey = '@MyApp:heightKey';

export default class App extends Component {
  state = {
    height: 0,
    heightText: '',
    weight: 0,
    weightText: '',
    bmi: 0,
    bmiText: '',
  };

  constructor(props) {
    super(props)
    this.onLoad();
  }

  onHeightChange = (heightText) => this.setState({ heightText });
  onWeightChange = (weightText) => this.setState({ weightText });
  calculate = (bmi) => this.setState({ bmi });
  convertHeight = (height) => this.setState({ height });
  convertWeight = (weight) => this.setState({ weight });
  convertBMI = (bmiText) => this.setState({bmiText});

   
  

  onLoad = async () => {
    try {
      const height = parseFloat(await AsyncStorage.getItem(heightKey));
      const bmiText = await AsyncStorage.getItem(bmiKey);
      this.convertHeight(height);
      this.convertBMI(bmiText);
    } catch (error) {
      Alert.alert('Error', 'There was an error while loading the data');
    }
  }

  onSave = async () => {
    const { heightText } = this.state;
    const { weightText } = this.state;
    let HEIGHT = parseFloat(heightText);
    this.convertHeight(HEIGHT);
    const { height } = this.state;
    let WEIGHT = parseFloat(weightText);
    this.convertWeight(WEIGHT);
    const { weight } = this.state;
    let BMI = ((weight / (height * height)) * 703);
    this.calculate(BMI);
    const { bmi } = this.state;
    let BMIText = "Body Mass Index is " + toString(bmi.toFixed(2));
    this.convertBMI(BMIText);
    const { bmiText } = this.state;

    try {
      await AsyncStorage.setItem(heightKey, heightText);
      await AsyncStorage.setItem(bmiKey, bmiText);
      Alert.alert('Saved', 'Successfully saved on device');
      console.log(bmiText);
      this.onLoad;
    } catch (error) {
      Alert.alert('Error', error);
    }
  }

  render() {
    const { heightText, weightText, bmiText} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.toolbar}>BMI Calculator</Text>
        <ScrollView style={styles.content}>
        <TextInput
            style={styles.input}
            onChangeText={this.onWeightChange}
            placeholder="Weight in Pounds"
          />
          <TextInput
            style={styles.input}
            onChangeText={this.onHeightChange}
            value={heightText}
            placeholder="Height in Inches"
          />
          <Pressable onPress={this.onSave} style={styles.button}>
            <Text style={styles.buttonText}>Compute BMI</Text>
          </Pressable>
          <Text style={styles.bmi}>{bmiText}</Text>
          
          <Text style={styles.assessment}>Assessing Your BMI</Text>
          <Text style={styles.assessment}> Underweight: less than 18.5</Text>
          <Text style={styles.assessment}> Healthy: 18.5 to 24.9</Text>
          <Text style={styles.assessment}> Overweight 25.0 to 29.9</Text>
          <Text style={styles.assessment}> Obese: 30.0 or higher</Text>
          
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toolbar: {
    backgroundColor: '#f4511e',
    color: '#fff',
    textAlign: 'center',
    padding: 25,
    fontSize: 28,
    fontWeight: 'bold',
  },
  assessment: {
    fontSize: 20,
  },
  bmi: {
    fontSize: 28,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 50,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  preview: {
    backgroundColor: '#bdc3c7',
    flex: 1,
    height: 500,
  },
  input: {
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    height: 40,
    padding: 5,
    marginBottom: 10,
    flex: 1,
    fontSize: 24,
  },
  button: {
    backgroundColor: '#34495e',
    padding: 10,
    borderRadius: 3,
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
  },
});
  



