/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Button,
    StyleSheet,
    Text,
    Alert,
    Image,
    View,
    ListView,
    TouchableHighlight,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import {Dimensions} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import Mock from 'mockjs'
import {get, post} from '../common/request'

const width = Dimensions
    .get('window')
    .width

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});

var hasMore = function () {
    return cacheResults.items.length < cacheResults.total;
};

const cacheResults = {
    nextPage: 1,
    items: [],
    total: 0
}

class Item extends Component {
    constructor(props) {
        super(props)
        this.state = {
            up: props.row.voted,
            row: props.row
        }
    }

    _up = () => {
        var row = this.state.row
        var body = {
            id: row.id,
            up: !this.state.up,
            accessToken: 'test'
        }
        post('up', body).then((rs) => {
            if (rs && rs.success) {
                this.setState({
                    up: !this.state.up
                })
            } else {
                Alert.alert('操作失败，请稍后再试')
            }
        }).catch(x => {
            console.error(x)
            Alert.alert('操作失败，请稍后再试')
        })
    }

    _onForward = () => {
        const {navigate} = this.props.navigation;
        var id = this.state.row;
        navigate('Detail', {id: id})
    }

    render() {
        var row = this.state.row
        return (
            <TouchableHighlight onPress={this._onForward}>
                <View style={styles.item}>
                    <Text style={styles.title}>{row.title}</Text>
                    <Image
                        style={styles.thumb}
                        source={{
                        uri: row.thumb
                    }}>
                        <Icon name='youtube-play' size={28} style={styles.play}></Icon>
                    </Image>
                    <View style={styles.itemFooter}>
                        <View style={styles.handleBox}>
                            <Icon
                                onPress={this._up}
                                name={this.state.up
                                ? 'heart'
                                : 'heart-o'}
                                size={28}
                                style={[
                                styles.up, this.state.up
                                    ? null
                                    : styles.down
                            ]}></Icon>
                            <Text onPress={this._up} style={styles.handleText}>喜欢</Text>
                        </View>
                        <View style={styles.handleBox}>
                            <Icon name='commenting-o' size={28} style={styles.commentIcon}></Icon>
                            <Text style={styles.handleText}>评论</Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

export default class Creation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: ds.cloneWithRows([]),
            isLoading: false,
            isRefreshing: false
        };
    }

    renderRow(row) {
        return (
            <Item row={row} navigation={this.props.navigation}></Item>
        );
    };

    componentDidMount() {

        this._fetchData(1);
    }

    _fetchData(page) {
        if (page != 0) {
            this.setState({isLoading: true})
        } else {
            this.setState({isRefreshing: true})
        }

        get('creations', {
            accessToken: 'zld',
            page: page
        }).then((responseJson) => {
            var items = cacheResults
                .items
                .slice();
            if (page != 0) {
                items = items.concat(responseJson.data)
            } else {
                items = responseJson
                    .data
                    .concat(items)
            }

            cacheResults.items = items;
            cacheResults.total = responseJson.total
            cacheResults.nextPage++;
            setTimeout(() => {
                if (page != 0) {
                    this.setState({
                        isLoading: false,
                        dataSource: ds.cloneWithRows(cacheResults.items)
                    })
                } else {
                    this.setState({
                        isRefreshing: false,
                        dataSource: ds.cloneWithRows(cacheResults.items)
                    })
                }
            }, 20);
        }).catch((error) => {
            console.error(error);
        });
    }

    _fetchMoreData() {
        if (!hasMore() || this.state.isLoading) {
            return;
        }
        var page = cacheResults.nextPage;
        this._fetchData(page);
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

    _onRefresh = () => {
        if (!hasMore() || this.state.isRefreshing) {
            return;
        }

        this._fetchData(0);
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text ship style={styles.headerTitle}>视频列表</Text>
                </View>
                <ListView
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    renderFooter={this.renderFooter}
                    onEndReached={() => this._fetchMoreData()}
                    onEndReachedThreshold={20}
                    renderRow={this
                    .renderRow
                    .bind(this)}
                    automaticallyAdjustContentInsets={false}
                    showsVerticalScrollIndicator={false}
                    refreshControl={< RefreshControl refreshing = {
                    this.state.isRefreshing
                }
                onRefresh = {
                    this._onRefresh
                }
                tintColor = "#ff6600" title = "正在刷新..." />}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF'
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
    item: {
        width: width,
        marginBottom: 10,
        backgroundColor: '#fff'
    },
    thumb: {
        width: width,
        height: width * 0.5,
        resizeMode: 'cover'
    },
    title: {
        padding: 10,
        fontSize: 18,
        color: '#333'
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#eee'
    },
    handleBox: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        width: width / 2 - 0.5
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
    handleText: {
        paddingLeft: 12,
        fontSize: 18,
        color: '#333'
    },
    up: {
        fontSize: 22,
        color: '#ed7b66'
    },
    down: {
        fontSize: 22,
        color: '#333'
    },
    commentIcon: {
        fontSize: 22,
        color: '#333'
    },
    loadingMore: {
        marginVertical: 20
    },
    loadingText: {
        textAlign: 'center'
    }
});
