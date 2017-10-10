//import liraries
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image
} from 'react-native';
import Video from 'react-native-video';
import {Dimensions} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

const width = Dimensions
    .get('window')
    .width

class Detail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rate: 1,
            volume: 1,
            muted: false,
            resizeMode: 'contain',
            duration: 0.0,
            currentTime: 0.0,
            paused: true
        };
    }

    componentWillMount() {
        console.log(this.props.navigation.state.params.id)
    }

    _back = () => {
        const {goBack} = this.props.navigation;
        goBack(null)
    }

    _togglePause = () => {
        this.setState({
            paused: !this.state.paused
        })
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
                        uri: 'http://42.236.62.25/youku/67657F08983E839D099DB55E6/03000A010059A7F546498838C66A995332ECF8-92DE-6160-0AE6-DA3DFD6674AA.mp4?sid=050764542549512852515&ctype=12&ccode=0512&duration=149&expire=18000&psid=3a3918c3234d9afb91674e28d6678be3&ups_client_netip=27.38.56.21&ups_ts=1507645425&ups_userid=&utid=5ckyErpaPCsCARsmOB4Ircsw&vkey=Acd1b02834d9a9c2c74cbec1335cf8feb&vid=XMzAwMDIzMDQxMg%3D%3D'
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

                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    showsVerticalScrollIndicator={false}
                    enableEmptySections={true}
                    style={styles.scrollView}>
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
                </ScrollView>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
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
        flex: 1, //子元素平均分配空间
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
        height: 360,
        backgroundColor: '#000'
    },

    video: {
        width: width,
        height: 360,
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
    }
});

//make this component available to the app
export default Detail;
