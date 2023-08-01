import { useEffect, useState } from 'react';
import { bancoDados } from './firebase.js';
import firebase from 'firebase/compat/app';

function Post(props) {

    const [comentarios, setComentarios] = useState([]);

    useEffect(() => {

        bancoDados.collection('post').doc(props.id).collection('comentarios').orderBy('times', 'desc').onSnapshot((snapshot) => {
            setComentarios(snapshot.docs.map((dados) => {
                return {
                    nome: dados.id,
                    comentario: dados.data()
                }
            }))
        });
    }, []);


    function comentar(id, e) {
        e.preventDefault();

        let comentarioAtual = document.querySelector('#textComentario' + id).value;

        bancoDados.collection('post').doc(id).collection('comentarios').add({
            nome: props.usuario,
            comentario: comentarioAtual,
            times: firebase.firestore.FieldValue.serverTimestamp()
        });

        document.getElementById('textComentario' + id).value = '';
    }


    return (
        <div className='post-single'>
            <img src={props.info.image} className='imagem-feed'></img>
            <p className='nome-titulo'><b>{props.info.userName}:</b> {props.info.titulo}</p>

            <div className='coments'>
                {
                    comentarios?.map((val) => {
                        return (
                            <div className='comentarios'>
                                <p><b>{val.comentario.nome}:</b> {val.comentario.comentario}</p>
                            </div>
                        )
                    })
                }
            </div>

            {
                (props.usuario) ?
                    <form className='formulario' onSubmit={(e) => comentar(props.id, e)}>
                        <textarea className='text-comentario' id={'textComentario' + props.id}></textarea>
                        <input className='input-comentar' type='submit' value="Comentar."></input>
                    </form>
                    :
                    <div></div>
            }
        </div>
    );
}

export default Post;