import { useState } from 'react';
import firebase from 'firebase/compat/app';
import { auth, storage, bancoDados } from './firebase.js';

function Header(props) {

    const [progress, setProgress] = useState(0);

    const [file, setFile] = useState(null);

    function abrirModal(e, nomeModal) {
        e.preventDefault();

        let modal = document.querySelector(nomeModal);

        modal.style.display = 'block';
    }


    function fecharModal(nomeModal) {
        let modal = document.querySelector(nomeModal);

        modal.style.display = 'none';
    }

    function uploadPost(e) {
        e.preventDefault();

        let tituloPost = document.getElementById('inputTitulo').value;

        const uploadTask = storage.ref(`images/${file.name}`).put(file);

        uploadTask.on("state_changed", (snapshot) => {

            setProgress(Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        }, (error) => {

        }, () => {
            storage.ref('images').child(file.name).getDownloadURL().then((url) => {
                bancoDados.collection('post').add({
                    titulo: tituloPost,
                    image: url,
                    userName: props.usuario,
                    times: firebase.firestore.FieldValue.serverTimestamp()
                });

                setProgress(0);
                setFile(null);

                document.getElementById('formUpload').reset();

                fecharModal('.modal-upload');
            })
        });
    }

    function criarConta(dados) {
        dados.preventDefault();

        let email = document.getElementById('inputEmail').value;
        let usuario = document.getElementById('inputUsuario').value;
        let senha = document.getElementById('inputSenha').value

        auth.createUserWithEmailAndPassword(email, senha).then((autenticacao) => {
            autenticacao.user.updateProfile({ displayName: usuario });

            alert('Conta criada com sucesso!');
            fecharModal('.modal-cadastro');

        }).catch((error) => {
            alert(error.message);
        });
    }

    function logar(e) {
        e.preventDefault();

        let email = document.getElementById('inputLoginEmail').value;
        let senha = document.getElementById('inputLoginSenha').value;

        auth.signInWithEmailAndPassword(email, senha).then((autenticacaoLogin) => {
            props.setUser(autenticacaoLogin.user.displayName);

            window.location.href = "/";
        });
    }

    function deslogar(e) {
        e.preventDefault();

        auth.signOut().then((valor) => {
            props.setUser(null);

            window.location.href = "/";
        });
    }

    return (


        <div className="header">

            <div className='modal-cadastro'>
                <div className='form-criar-conta'>
                    <div onClick={() => fecharModal('.modal-cadastro')} className='fechar-modal'>X</div>
                    <h2>Criar conta.</h2>
                    <form onSubmit={(e) => criarConta(e)}>
                        <input id='inputEmail' type='text' placeholder='Seu email..'></input>
                        <input id='inputUsuario' type='text' placeholder='Seu user name..'></input>
                        <input id='inputSenha' type='password' placeholder='Seu senha..'></input>
                        <input type='submit' value='Criar'></input>
                    </form>
                </div>
            </div>

            <div className='modal-upload'>
                <div className='form-upload'>
                    <div onClick={() => fecharModal('.modal-upload')} className='fechar-modal'>X</div>
                    <h2>Fazer upload.</h2>
                    <form id='formUpload' onSubmit={(e) => uploadPost(e)}>
                        <progress id='progessUpload' value={progress}></progress>
                        <input id='inputTitulo' type='text' placeholder='Nome da sua foto...'></input>
                        <input onChange={(e) => setFile(e.target.files[0])} id='inputFile' type='file'></input>
                        <input type='submit' value='Criar post'></input>
                    </form>
                </div>
            </div>

            <div className="center">
                <div className="header__logo">
                    <a href=""><img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" ></img></a>
                </div>

                {
                    (props.usuario) ?
                        <div className='header-logado-info'>
                            <span>Ola <b>{props.usuario}</b> </span>
                            <a onClick={(e) => abrirModal(e, '.modal-upload')} href='#'>Postar</a>
                            <a onClick={(e) => deslogar(e)}>Deslogar</a>
                        </div>
                        :
                        <div className="header__loginForm">
                            <form onSubmit={(e) => logar(e)}>
                                <input id='inputLoginEmail' className='input-login' type="text" placeholder="Login..."></input>
                                <input id='inputLoginSenha' className='input-senha' type="password" placeholder="Senha..."></input>
                                <input className='input-submit' type="submit" name='acao' value="Logar!"></input>
                            </form>
                            <div className='botao-criar-conta'>
                                <a onClick={(e) => abrirModal(e, '.modal-cadastro')} href=''>Criar conta</a>
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

export default Header;

