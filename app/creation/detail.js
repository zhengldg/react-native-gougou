//import liraries
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ListView,
    Image,
    TextInput,
    ActivityIndicator,
    Modal,
    Alert
} from 'react-native';
import Video from 'react-native-video';
import {Dimensions} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import {get, post} from '../common/request'
import Button from 'react-native-button'

const width = Dimensions
    .get('window')
    .width

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});

const cacheResults = {
    items: [],
    total: 0,
    nextPage: 1
}

var hasMore = function () {
    return cacheResults.items.length < cacheResults.total;
};

class Detail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: ds.cloneWithRows([]),
            isLoading: false,
            modalVisible: false,
            rate: 1,
            volume: 1,
            muted: false,
            resizeMode: 'contain',
            duration: 0.0,
            currentTime: 0.0,
            paused: true
        };
    }

    componentDidMount() {
        this._fetchCommentsData()
    }

    _back = () => {
        const {goBack} = this.props.navigation;
        goBack(null)
    }

    _fetchCommentsData() {
        this.setState({isLoading: true})
        var videoId = this.props.navigation.state.params.id.id
        get('comments', {
            accessToken: 'test',
            videoId: videoId
        }).then((rs) => {
            if (rs.success) {
                var items = cacheResults
                    .items
                    .slice();
                items = items.concat(rs.data)
                cacheResults.total = rs.total
                cacheResults.nextPage++;
                cacheResults.items = items;
                this.setState({
                    dataSource: ds.cloneWithRows(items),
                    isLoading: false
                })
            }
        }).catch((e) => {})
    }

    _togglePause = () => {
        this.setState({
            paused: !this.state.paused
        })
    }

    _fetchMoreData() {
        if (!hasMore()) {
            return;
        }
        var page = cacheResults.nextPage;
        this._fetchCommentsData(page);
    }

    renderFooter() {
        if (!hasMore() && cacheResults.total != 0) {
            return (
                <View style={styles.loadingMore}>
                    <Text style={styles.loadingText}>没有更多了</Text>
                </View>
            )
        } else {
            return (<ActivityIndicator style={styles.loadingMore} size="large"/>);
        }
    }

    _focus = () => {
        this._setModalVisible(true)
    }

    _setModalVisible(visible) {
        this.setState({modalVisible: visible})
    }

    _blur = () => {}

    _closeModel = () => {
        this._setModalVisible(false)
    }

    renderHeader = () => {
        const data = this.props.navigation.state.params.id
        return <View style={styles.listHeader}>
            <View style={styles.infoBox}>
                <Image
                    style={styles.avatar}
                    source={{
                    uri: data.author.avatar
                }}></Image>
                <View style={styles.descBox}>
                    <Text style={styles.nickname}>{data.author.nickname}</Text>
                    <Text style={styles.title}>{data.title}</Text>
                </View>
            </View>
            <View style={styles.commentBox}>
                <View style={styles.comment}>
                    <Text>敢不敢评论一个</Text>
                    <TextInput
                        placeholder="好喜欢这个视频啊..."
                        style={styles.content}
                        multiline={true}
                        onFocus={this._focus}></TextInput>
                </View>
            </View>
            <View style={styles.commentArea}>
                <Text >精彩评论</Text>
            </View>
        </View>
    }

    _renderRow(row) {
        return <View key={row.id} style={styles.replyBox}>
            <Image
                style={styles.replyAvatar}
                source={{
                uri: row.replyBy.avatar
            }}></Image>
            <View style={styles.reply}>
                <Text style={styles.replyNickname}>{row.replyBy.nickname}</Text>
                <Text style={styles.replyContent}>{row.content}</Text>
            </View>
        </View>
    }

    _submit = () => {
        if (!this.state.content) {
            Alert.alert("评论内容不能为空");
        }
    }

    render() {
        const data = this.props.navigation.state.params.id
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle} onPress={this._back}>返回到列表</Text>
                </View>
                <View style={styles.videoBox}>
                    <Video
                        style={styles.video}
                        source={{
                        uri: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
                    }}
                        rate={this.state.rate}
                        paused={this.state.paused}
                        volume={this.state.volume}
                        muted={this.state.muted}
                        resizeMode={this.state.resizeMode}
                        repeat={true}/>
                    <TouchableOpacity style={styles.togglePlay} onPress={this._togglePause}>
                        {this.state.paused && <Icon name='youtube-play' size={28} style={styles.play}></Icon>
}
                    </TouchableOpacity>
                </View>

                <ListView
                    renderHeader={this.renderHeader}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    automaticallyAdjustContentInsets={false}
                    showsVerticalScrollIndicator={false}
                    enableEmptySections={true}
                    renderFooter={this.renderFooter}
                    onEndReached={() => this._fetchMoreData()}
                    onEndReachedThreshold={20}
                    style={styles.listview}></ListView>
                <Modal
                    animationType={"fade"}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                    this._setModalVisible(false)
                }}>
                    <View style={styles.modalContainer}>
                        <Icon onPress={this._closeModel} name='close' style={styles.closeIcon}></Icon>
                        <View style={styles.commentBox}>
                            <View style={styles.comment}>
                                <Text>敢不敢评论一个</Text>
                                <TextInput
                                    placeholder="好喜欢这个视频啊..."
                                    style={styles.content}
                                    multiline={true}
                                    defaultValue
                                    ={this.state.content}
                                    onChangeText={(text) => {
                                    this.setState({content: text})
                                }}></TextInput>
                            </View>
                        </View>
                        <Button style={styles.submitBtn} onPress={this._submit}>评论</Button>
                    </View>
                </Modal>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    submitBtn: {
        alignSelf:'center',
        width: width - 20,
        padding: 16,
        marginTop: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ee753c',
        borderRadius: 4,
        color: '#ee753c',
        fontSize: 18
    },
    modalContainer: {
        flex: 1,
        paddingTop: 45,
        backgroundColor: '#fff'
    },
    closeIcon: {
        alignSelf: 'center',
        fontSize: 30,
        color: '#ee753c'
    },

    commentArea: {
        width: width,
        marginTop: 8,
        paddingBottom: 6,
        paddingLeft: 10,
        paddingRight: 19,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    commentBox: {
        marginVertical: 10,
        padding: 8,
        width: width
    },
    content: {
        paddingLeft: 2,
        color: '#333',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        fontSize: 14,
        height: 80
    },
    listHeader: {
        width: width,
        marginTop: 10
    },

    listview: {
        width: width,
        marginTop: 5
    },
    replyBox: {
        width: width,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 10
    },
    replyAvatar: {
        width: 40,
        height: 40,
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 20
    },
    replyNickname: {
        color: '#666'
    },
    replyContent: {
        color: '#666',
        marginTop: 4
    },
    reply: {
        flex: 1
    },

    infoBox: {
        width: width,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    },
    avatar: {
        width: 60,
        height: 60,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 30
    },
    descBox: {
        flex: 1, //子元素平均分配空间,
    },
    nickname: {
        fontSize: 18
    },
    title: {
        marginTop: 8,
        fontSize: 16,
        color: "#666"
    },
    togglePlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        height: 360,
        width: width
    },
    play: {
        position: 'absolute',
        bottom: 14,
        right: 14,
        width: 46,
        height: 46,
        paddingTop: 9,
        paddingLeft: 11,
        backgroundColor: 'transparent',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 23,
        color: '#ed7b66'
    },

    videoBox: {
        width: width,
        height: 300,
        backgroundColor: '#000'
    },

    video: {
        width: width,
        height: 300,
        backgroundColor: '#000'
    },
    header: {
        paddingTop: 25,
        paddingBottom: 12,
        backgroundColor: '#ee735c'
    },
    headerTitle: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600'
    },
    container: {
        flex: 1
    },
    loadingMore: {
        marginVertical: 20
    },
    loadingText: {
        textAlign: 'center'
    }
});

//make this component available to the app
export default Detail;
