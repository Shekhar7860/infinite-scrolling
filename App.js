import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator
} from 'react-native';

class App extends React.Component {
  state = {
    seed: 1,
    page: 1,
    users: [],
    isLoading: false,
    isRefreshing: false,
    visible:false
  };

  loadUsers = () => {
    const { users, seed, page } = this.state;
    this.setState({ isLoading: true });

    fetch(`https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`)
      .then(res => res.json())
      .then(res => {
        this.setState({
          users: page === 1 ? res.results : [...users, ...res.results],
          isRefreshing: false,
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  handleRefresh = () => {
    this.setState({
      seed: this.state.seed + 1,
      isRefreshing: true,
    }, () => {
      this.loadUsers();
    });
  };

  handleLoadMore = () => {
    this.setState({visible:true})
        setTimeout(() => {
   this.setState({visible : false})
  this.setState({
      page: this.state.page + 1
    }, () => {
      this.loadUsers();
    });
   }, 3000)

   
  };

  componentDidMount() {
    this.loadUsers();
  };
  renderfooter=()=> {
    return (<ActivityIndicator size={'large'} animating={this.state.visible}/>)
  }

  render() {
    const { users, isRefreshing } = this.state;

    return (
      <View style={s.scene}>
        {
          users &&
            <FlatList
              data={users}
              renderItem={({item}) => (
                <View>
                <Image source={{uri:item.picture.thumbnail}} style={{width:200, height:200, alignSelf:'center'}}/>
                <Text style={{textAlign:'center'}}>{item.name.first}</Text>
                 <Text style={{textAlign:'center'}}>{item.email}</Text>
                 </View>
                
              )}
              ListFooterComponent={this.renderfooter.bind(this)}
              keyExtractor={i => i.email}
              refreshing={isRefreshing}
              onRefresh={this.handleRefresh}
              onEndReached={this.handleLoadMore}
              onEndThreshold={0}
            />
        }
      </View>
    )
  }
}

const s = StyleSheet.create({
  scene: {
    flex: 1,
    paddingTop: 25,
  },
  user: {
    width: '100%',
    backgroundColor: '#333',
    marginBottom: 10,
    paddingLeft: 25,
  },
  userName: {
    fontSize: 17,
    paddingVertical: 20,
    color: '#fff'
  }
});

export default App;