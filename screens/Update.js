import React from 'react';

import { Container, Footer, FooterTab, Content, Header, Left, Body, Right, Button, Icon, Title, Text }from 'native-base';

export default function Update({ navigation }) {
    return (
        <Container>
            <Header>
                <Left>
                    <Button transparent onPress={() => navigation.openDrawer()}>
                        <Icon name='menu' />
                    </Button>
                </Left>
                <Body>
                    <Title>Post an update</Title>
                </Body>
            </Header>
            <Content>
                <Text>Post an update!</Text>
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