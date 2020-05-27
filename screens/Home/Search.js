import React from 'react';
import { StyleSheet } from 'react-native';

import { Container, Header, Button, Icon, Left, Item, Input }from 'native-base';

export default function Search({ navigation }) {
    return (
      <Container>
        <Header searchBar rounded>
          <Left style={styles.left}>
            <Button transparent onPress={() => navigation.goBack()}>
                <Icon name='arrow-back' />
            </Button>
          </Left>
          <Item>
            <Icon name="ios-search" />
            <Input placeholder="Search" autoFocus onChangeText={text => alert("Searching for: " + text)}/>
          </Item>
        </Header>
      </Container>
    );
  }


const styles = StyleSheet.create({
  left: {
    flex: 0.15,
  },
});