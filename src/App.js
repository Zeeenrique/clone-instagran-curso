
import './App.css';
import { useEffect, useState } from 'react';
import { bancoDados, auth } from './firebase.js';
import Header from './Header';
import Post from './Post'

function App() {
  const [user, setUser] = useState();

  const [posts, setPosts] = useState([]);

  useEffect(() => {

    auth.onAuthStateChanged((dados) => {
      setUser(dados?.displayName);
    });

    bancoDados.collection('post').orderBy('times', 'desc').onSnapshot((snapshot) => {
      setPosts(snapshot.docs.map((dados) => {
        return {
          id: dados.id,
          info: dados.data()
        }
      }))
    });
  }, []);

  

  return (
    <div className="App">
      <Header setUser={setUser} usuario={user}></Header>

      {
        posts.map((valor) => {
          return (
            <Post usuario={user} info={valor.info} id={valor.id}/>
          )
        })
      }
    </div>
  );
}

export default App;
