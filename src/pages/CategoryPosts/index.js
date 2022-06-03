import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../../services/api';
import PostItem from '../../components/PostItem';

export default function CategoryPosts() {
    const navigation = useNavigation();
    const route = useRoute();
    const [posts, setPosts] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: route.params?.title === '' ? 'categoria' : route.params?.title
        });

    }, [navigation]);

    useEffect(() => {
        async function loadPost() {
            const response = await api.get(`api/categories/${route.params?.id}?fields=name&populate=posts,posts.cover`);
            setPosts(response.data?.data?.attributes?.posts?.data);
        }

        loadPost();

    }, []);

    function handleBack() {
        navigation.goBack();
    }

    return (
        <View style={styles.container}>

            {posts.length === 0 && (
                <View style={styles.warningContainer}>
                    <Text style={styles.warning}>Essa categoria ainda não possui nenhum post</Text>
                    <TouchableOpacity
                        onPress={handleBack}
                        style={styles.backButton}>
                        <Text style={styles.textButton}>Encontrar posts</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                showsVerticalScrollIndicator={false}
                style={{ tlex: 1 }}
                data={posts}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => <PostItem data={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: 18,
    },
    warningContainer: {
        alignItems: 'center'
    },
    warning: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    backButton: {
        backgroundColor: '#162133',
        padding: 8,
        marginTop: 12,
        borderRadius: 4
    },
    textButton: {
        color: '#FFF'
    }

});

