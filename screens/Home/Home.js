import React from 'react';

import { Container, Footer, FooterTab, Content, Header, Left, Body, Right, Button, Icon, Title, Text } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const StackNavigator = createStackNavigator();

export default function Home({ navigation }) {
    return (
        <Container>
            <Header>
                <Left>
                    <Button transparent onPress={() => navigation.openDrawer()}>
                        <Icon name='menu' />
                    </Button>
                </Left>
                <Body>
                    <Title>ICON</Title>
                </Body>
                <Right>
                    <Button transparent onPress={() => navigation.navigate('Search')}>
                      <Icon name='search' />
                    </Button>
                </Right>
            </Header>
            <Content>
                <Button>
                    <Text>Ask a question</Text>
                </Button>
                <Button>
                    <Text>Post an update</Text>
                </Button>
            </Content>
            <Footer>
                <FooterTab>
                    <Button full>
                        <Text>Footer</Text>
                    </Button>
                </FooterTab>
            </Footer>
        </Container>
    );
  }