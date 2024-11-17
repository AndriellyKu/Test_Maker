import React, { useState } from "react";
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
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate(); 


  const handleClickCadastro = async (values) => {
    const formData = new FormData();
    if (values.profilePicture) {
        formData.append('profilePicture', values.profilePicture);
    }
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('username', values.username);
    formData.append('userType', values.userType);
    formData.append('escola', values.escola);


    try {
        const response = await axios.post('http://localhost:3000/auth/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('Cadastro realizado com sucesso', response.data);
        navigate("/login");
    } catch (error) {
      console.error("Erro ao registrar o usuário:", error);
      res.status(500).json({ message: "Erro ao registrar o usuário", details: error.message });
  }
};


  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setFieldValue("profilePicture", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
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
          {({ setFieldValue, values }) => (
            <Form className="CadastroForm" encType="multipart/form-data">
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
                  <label className="etiquetaCadastro" htmlFor="userType">Você é</label>
                  <Field className="Cadastrocampo" as="select" name="userType">
                    <option value="">Selecione</option>
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
                    onChange={(event) => handleImageChange(event, setFieldValue)} 
                  />
                  {previewImage && <img src={previewImage} alt="Prévia da Imagem" style={{ maxHeight: '100px' }} />}
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
