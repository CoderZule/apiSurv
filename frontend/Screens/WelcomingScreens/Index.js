import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import Intro from '../../Components/Intro';

export default class Index extends Component {
    render() {
        return (
            <View style={{flex:1}} >
                  <Intro />
            </View>
        );
    }
}
