import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CustomDrawerItem = ({ label, icon, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.drawerItemContainer}>
        <Text style={styles.drawerItemLabel}>{label}</Text>
        <View style={styles.iconContainer}>
            {icon()}
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    drawerItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    drawerItemLabel: {
        fontSize: 17,
        color: '#000000',
    },
    iconContainer: {
        marginLeft: 10,
    },
});

export default CustomDrawerItem;
