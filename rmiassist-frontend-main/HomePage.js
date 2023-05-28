import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, Linking, Image, ScrollView } from 'react-native';

export default function HomePage ({navigation}){
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);

  const handleDropDown = () => {
    setIsDropDownVisible(!isDropDownVisible);
  };

  const articles = [
    {
      id: 1,
      title: 'What is ChatGPT and why does it matter? Here\'s everything you need to know',
      url: 'https://www.zdnet.com/article/what-is-chatgpt-and-why-does-it-matter-heres-everything-you-need-to-know/',
      image: require('./assets/download.png'),
    },
    {
      id: 2,
      title: 'The End of the Modern Academy: A Response to “The Humanities in Ruins”',
      url: 'https://humdev.uchicago.edu/sites/humdev.uchicago.edu/files/uploads/Shweder/2017_EndModernAcademy.pdf',
      image: require('./assets/academy.png'),
    },
    {
      id: 3,
      title: 'Meaning of Life',
      url: 'https://plato.stanford.edu/entries/life-meaning/',
      image: require('./assets/life.png'),
    },
  ];

  const handleArticlePress = (url) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
          <Text style={styles.dropDownButtonText}>
            Some Academic Articles
          </Text>
          <View>
            {articles.map((article) => (
              <TouchableOpacity
                key={article.id}
                style={styles.link}
                onPress={() => handleArticlePress(article.url)}
              >
              <View style={styles.box}>
                <Text style={styles.linkText}>{article.title}</Text>
                <Image source={article.image} style={styles.image} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "lightblue",
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  dropDownButtonText: {
    paddingTop: 15,
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  link: {
    paddingVertical: 10,
  },
  linkText: {
    fontSize: 16,
    color: '#2A3D66',
    paddingBottom: 10,
  },
  box: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#2A3D66',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  image: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#2A3D66',
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  }
});