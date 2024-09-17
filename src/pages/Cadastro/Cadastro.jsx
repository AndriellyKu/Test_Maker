import React from "react";
import './Cadastro.css';
import backgroundImage from '../../assets/imagens/BackgroundGradientLogin.gif';
import { Link, useNavigate } from "react-router-dom"; 
import { Formik, Field, Form, ErrorMessage } from "formik"; 
import * as yup from 'yup';
import axios from "axios";

const ValidationCadastro = yup.object().shape({
    email: yup.string().email('Email inválido').required('Email é obrigatório'),
    password: yup.string().min(8, 'Senha deve ter no mínimo 8 caracteres').required('Senha é obrigatória'),
    username: yup.string().required('Nome de usuário é obrigatório'),
    userType: yup.string().required('Selecione se você é aluno ou professor'),
    escola: yup.string().required('O nome da escola é obrigatório'),
});

const Cadastro = () => {
  const navigate = useNavigate(); 

  const handleClickCadastro = async (values) => {
    console.log('Dados cadastrados:', values);
  
    try {
      
      const response = await axios.post('http://localhost:3000/auth/register', values);
  

      if (response.status === 201) {
        navigate("/login"); 
      } else {
        console.error('Erro no cadastro:', response.data.msg);
        alert(response.data.msg); 
      }
    } catch (error) {
      console.error('Erro ao se conectar com o backend:', error.response?.data || error.message);
      alert('Erro ao se conectar com o backend. Tente novamente mais tarde.');
    }
  };
  

  return (
    <div className="CadastroFundo" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="CadastroFormBackground">
        <Formik
          initialValues={{ 
            email: '', 
            password: '', 
            username: '', 
            userType: '', 
            escola: '', 
            profilePicture: null
          }}
          validationSchema={ValidationCadastro}
          onSubmit={handleClickCadastro}
        >
          {({ setFieldValue, errors, touched }) => (
            <Form className="CadastroForm">
              <h1 className="CadLeg">Cadastro</h1>
              <div className="Organizacao-cadastro-containerum">
                <div className="Container-particao-cadastro">
                  <label className="etiquetaCadastro" htmlFor="username">Nome</label>
                  <Field className="Cadastrocampo" type="text" name="username" placeholder="Nome de usuário" id="username" />
                  <ErrorMessage name="username" component="div" className="error-message" />

                  <label className="etiquetaCadastro" htmlFor="email">Email</label>
                  <Field className="Cadastrocampo" type="email" name="email" placeholder="Email" id="email" />
                  <ErrorMessage name="email" component="div" className="error-message" />

                  <label className="etiquetaCadastro" htmlFor="password">Senha</label>
                  <Field className="Cadastrocampo" type="password" name="password" placeholder="Senha" id="password" />
                  <ErrorMessage name="password" component="div" className="error-message" />
                </div>
                <div className="Container-particao-cadastrodois">
                  <label  className="etiquetaCadastro" htmlFor="userType">Você é</label>
                  <Field className="Cadastrocampo" as="select" name="userType">
                    <option className="opt-usertype" value="professor">Professor</option>
                    <option className="opt-usertype" value="aluno">Aluno</option>
                  </Field>
                  <ErrorMessage name="userType" component="div" className="error-message" />

                  <label className="etiquetaCadastro" htmlFor="escola">Escola</label>
                  <Field className="Cadastrocampo" type="text" name="escola" placeholder="Nome da Escola" />
                  <ErrorMessage name="escola" component="div" className="error-message" />

                  <label className="etiquetaCadastro" htmlFor="profilePicture">Foto de Perfil (Opcional)</label>
                  <input
                    className="sbmt-button-img"
                    type="file"
                    accept="image/*"
                    name="profilePicture"
                    onChange={(event) => {
                      setFieldValue("profilePicture", event.currentTarget.files[0]);
                    }}
                  />
                </div>
              </div>  
              <button className="BtnSubmitC" type="submit">Cadastrar</button>

              <Link className="CadastroLink" to="/login">Já tem uma conta? Faça login</Link>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Cadastro;
