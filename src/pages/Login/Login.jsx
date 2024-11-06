import React from "react";
import './Login.css';
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from '../../assets/imagens/BackgroundGradientLogin.gif';
import LogoTestMaker from '../../assets/imagens/logOtesteMaker.png';
import { ErrorMessage, Field, Formik } from "formik";
import * as yup from 'yup';
import Axios from "axios";

// A variável de ambiente deve ser acessada corretamente
const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
    const navigate = useNavigate();

    const handleClickLogin = async (values) => {
        try {
            const response = await Axios.post(`${API_URL}/auth/login`, {
                email: values.email,
                password: values.password,
            });
            // Verifique se a resposta é JSON antes de continuar
            if (response.headers['content-type'].includes('application/json')) {
                // Continue com o processamento normal
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    redirectToHome(response.data.userType);
                }
            } else {
                console.error("Resposta não é JSON válida", response);
            }
        } catch (error) {
            console.error('Erro ao realizar login:', error.response?.data || error.message);
            alert("Erro ao realizar login: Verifique suas credenciais.");
        }
    };
    

    const redirectToHome = (userType) => {
        if (userType === 'professor') {
            navigate('/professorhome');
        } else if (userType === 'aluno') {
            navigate('/alunohome');
        }
    };

    const ValidationLogin = yup.object().shape({
        email: yup.string().email('Email inválido').required('Email é obrigatório'),
        password: yup.string().min(8, 'Senha deve ter no mínimo 8 caracteres').required('Senha é obrigatória'),
    });

    return (
        <div className="Lfundo" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="formbackground">
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={ValidationLogin}
                    onSubmit={handleClickLogin}
                >
                    {({ handleSubmit }) => (
                        <form className="LoginForm" onSubmit={handleSubmit}>
                            <div className="containerBrand">
                                <div className="LogoTmLogin">
                                    <img src={LogoTestMaker} alt="logo" />
                                </div>
                                <h1 className="logoNome">Test Maker</h1>
                            </div>

                            <label className="Etiquetalogin" htmlFor="email">Email</label>
                            <Field className="CampoLogins" name="email" placeholder="Email" id="email" />
                            <ErrorMessage component="span" name="email" className="form-error" />
        
                            <label className="Etiquetalogin" htmlFor="password">Senha</label>
                            <Field className="CampoLogins" type="password" name="password" placeholder="Senha" id="password" />
                            <ErrorMessage component="span" name="password" className="form-error" />
        
                            <button className="BtNsubmitLogin" type="submit">Entrar</button>

                            <Link className="CadastroLegenda" to="/cadastro">Não tem uma conta? Cadastre-se</Link>
                        </form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Login;
