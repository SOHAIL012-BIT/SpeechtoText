import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity,TextInput, StyleSheet } from 'react-native';
import Voice from '@react-native-voice/voice';
import Icon from 'react-native-vector-icons/FontAwesome';



const unit_of_measure_for_product=(speech_transcript)=>{

const unitArray = ['Bags', 'Bottles', 'Box', 'Bundles', 'Cans', 'Cartons', 'Dozens', 'Feet', 'Gallon', 'Grams', 'Gaz', 'KG', 'Kilogram', 'Litre', 'Meters', 'Ml', 'Numbers', 'Packs', 'Pairs', 'Pieces', 'Pound', 'Quarter', 'Ream', 'Roll', 'Tola', 'Thaan', 'Yards'];


const regex = /(\d+)\s+(\w+)/;
const match = speech_transcript.match(regex);

if (match) {
    const quantity = parseInt(match[1]);
    const inputUnit = match[2];

    const closestUnit = findClosestWord(inputUnit, unitArray);

    return {
        quantity,
        unit: closestUnit
    };
} else {
  const quantity = 1;
  const inputUnit = speech_transcript;

  const closestUnit = findClosestWord(inputUnit, unitArray);

  return {
      quantity,
      unit: closestUnit
  };
}

}

  function levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;

    const dp = new Array(m + 1).fill(null).map(() => new Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) {
        dp[i][0] = i;
    }

    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
    }

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost
            );
        }
    }

    return dp[m][n];
}

function findClosestWord(inputWord, wordArray) {
    let closestWord = null;
    let minDistance = Infinity;

    wordArray.forEach(word => {
        const distance = levenshteinDistance(inputWord.toLowerCase(), word.toLowerCase());

        if (distance < minDistance) {
            minDistance = distance;
            closestWord = word;
        }
    });

    return closestWord;
}



const VoiceInput = () => {
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [stockdata,setStockData] = useState();
  const [productName,setProductName]=useState("");
  const [isProductname, setIsProductname] = useState(true);



  const handleQuantityChange = (text) => {
    setStockData((prevData) => ({ ...prevData, quantity: text }));
  };

  const handleUnitOfMeasureChange = (text) => {
    setStockData((prevData) => ({ ...prevData, unit: text }));
  };



  useEffect(() => {
    Voice.onSpeechStart = () => {
      console.log("Speech started");
      setIsRecording(true);
    };

    Voice.onSpeechStop = () => {
      console.log("Speech stopped");
      setIsRecording(false);
    };

    Voice.onSpeechError = (err) => {
      console.log("Speech error", err);
      setError(err?.message || 'Speech recognition error');
    };

    Voice.onSpeechResults = (results) => {
      console.log("Speech results", results);
      setResult(results.value[0]);
    };

    return () => {
      Voice.removeAllListeners();
    };
  }, []); 

  const startRecording = async () => {
    try {
      console.log("In start");
      await Voice.start('en-PK');
    } catch (err) {
            print("Error starting speech recognition",err)

      setError(err.message || 'Error starting speech recognition');
    }
  };

  const stopRecording = async () => {
    try {
      console.log("In stop");
      await Voice.stop();
      setIsRecording(false);
    } catch (err) {
      print("Error stopping speech recognition",err)
      setError(err.message || 'Error stopping speech recognition');
    }
  };

  console.log("Result is", result);


  useEffect(() => {

    if (result.length > 1){
    
      // if (isProductname){

      //   setProductName(result)
      // }
      // else{
      unit_of_measure= unit_of_measure_for_product(result) 
      setStockData(unit_of_measure)

      // }   
    }


  },[result])



  return (
    <View style={{marginTop:50}}>
      <View style={{ alignItems: 'center', margin: 10 }}>
      <Text style={{ fontSize: 20, color: "green", fontWeight: '500' }}>
      Add Stock Using Voice
      </Text>
      <Text>{result}</Text>

      {/* <TouchableOpacity style={{ marginTop: 30 }} onPress={isRecording ? stopRecording : startRecording}>
        <Text style={{ color: 'red' }}>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
      </TouchableOpacity> */}


<TouchableOpacity style={{ marginTop: 30 }} onPress={isRecording ? stopRecording : startRecording}>
      {/* {isRecording ? (
        <Icon name="microphone" size={30} color="red" />
      ) : (
        <Icon name="microphone" size={30} color="white" />
      )} */}
      <Text style={{ marginLeft: 10, color: 'red' }}>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
    </TouchableOpacity>



      <Text>Quantity: {stockdata?.quantity}</Text>
      <Text>Unit of Measure: {stockdata?.unit}</Text>
      </View>

      <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={productName}
        onChangeText={(text) => setProductName(text)}
      />

      <View style={styles.rowContainer}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Quantity"
          keyboardType="numeric"
          value={stockdata?.quantity}
          onChangeText={handleQuantityChange}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Unit of Measure"
          value={stockdata?.unit}
          onChangeText={handleUnitOfMeasureChange}
        />
      </View>
    </View>


    {/* <TouchableOpacity
        style={{ marginTop: 30, alignItems: "center" }}
        onPress={() => setIsProductname((prevIsProductname) => !prevIsProductname)}
      >
        <Text style={{ color: 'white' }}>{isProductname ? 'Switch to Unit' : 'Switch to Product Name'}</Text>
      </TouchableOpacity> */}

<TouchableOpacity
        style={{ marginTop: 30, alignItems: "center" }}
        onPress={() => 
         { setResult("")
          setStockData({});
          
        }

        
        }
      >
        <Text>Reset</Text>
        
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginRight: 5,
  },
});

export default VoiceInput;
