import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    ScrollView,
    TouchableOpacity,
    Share,
    Modal
} from 'react-native';
import api from '../../services/api';
import { Feather, Entypo } from '@expo/vector-icons';

import { useNavigation, useRoute } from '@react-navigation/native';
import LinkWeb from '../../components/LinkWeb';

export default function Detail() {
    const route = useRoute();
    const navigation = useNavigation();

    const [post, setPost] = useState({});
    const [links, setLinks] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [openLink, setOpenLink] = useState({});

    useEffect(() => {
        async function getPost() {
            const response = await api.get(`api/posts/${route.params?.id}?populate=cover,category,Opcoes`);
            setPost(response.data.data);
            setLinks(response.data?.data?.attributes?.Opcoes);
        }
        getPost();

    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleShare}>
                    <Entypo name="share" size={30} color="#FFF" />
                </TouchableOpacity>
            )
        });
    }, [navigation, post]);

    async function handleShare() {
        try {
            const result = await Share.share({
                message: `
                Confere esse post: ${post?.attributes?.title}

                ${post?.attributes?.description}

                Vi la no app devblog
                `
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('activity type');
                } else {
                    console.log("COMPARTILHADO COM SUCESSO");
                }
            } else if (result.action === Share.dismissedAction) {
                console.log("MODAL FECHADO");
            }
        } catch (error) {
            console.log('erro');
        }
    }

    function handleOpenLink(link) {
        setModalVisible(true);
        setOpenLink(link);
    }


    return (
        <SafeAreaView style={styles.container}>
            <Image
                style={styles.cover}
                source={{ uri: `http://10.0.0.102:1337${post?.attributes?.cover?.data?.attributes?.url}` }}
            />
            <Text
                style={styles.title}>{post?.attributes?.title}
            </Text>
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

                <Text
                    style={styles.description}>
                    {post.attributes?.description}
                </Text>

                {links.length > 0 && (
                    <Text style={styles.subTitle}>Link</Text>
                )}

                {links.map(link => (
                    <TouchableOpacity
                        onPress={() => handleOpenLink(link)}
                        style={styles.linkButton}
                        key={link.id}
                    >
                        <Feather name='link' color={'#1e4687'} size={14} />
                        <Text style={styles.linkText}>{link.name}</Text>
                    </TouchableOpacity>
                ))}

            </ScrollView>
            <Modal visible={modalVisible} transparent={true}>
                <LinkWeb
                    closeModal={() => setModalVisible(false)}
                    title={openLink?.name}
                    link={openLink?.url}
                />
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    cover: {
        width: '100%',
        height: 230,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 14,
        marginTop: 18,
        paddingHorizontal: 12,
    },
    content: {
        paddingHorizontal: 12,
    },
    description: {
        lineHeight: 20,
    },
    subTitle: {
        fontWeight: 'bold',
        marginTop: 14,
        fontSize: 18,
        marginBottom: 6
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    linkText: {
        color: '#1e4687',
        fontSize: 16,
        marginLeft: 6
    },
    button: {
        padding: 10,
        backgroundColor: '#232630',
        marginTop: 60,
        flexDirection: 'row',
        alignItems: 'center'
    },
    name: {
        color: '#FFF',
        marginLeft: 8,
        fontSize: 18,
        fontWeight: 'bold'

    }
});

