import React, { useState } from "react";
import "./TecnicoRegistro.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  FaUserAlt,
  FaPhoneVolume,
  FaLock,
  FaUnlock,
  FaUserCheck,
} from "react-icons/fa";
import { MdMarkEmailRead, MdHomeRepairService } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";

type TypeIniditialValues = {
  nombre: string;
  telefono: string;
  email: string;
  password: string;
  passwordConfirm: string;
  lugares: string;
  servicios: string;
  precioMin: string;
  precioMax: string;
  experiencia: string;
  check: boolean;
};

type RegisterFetch = {
  email: string;
  name?: string;
  password: string;
};

const initialValues: TypeIniditialValues = {
  nombre: "",
  telefono: "",
  email: "",
  password: "",
  passwordConfirm: "",
  lugares: "",
  servicios: "",
  experiencia: "",
  precioMin: "",
  precioMax: "",
  check: false,
};

const validationSchema = Yup.object({
  nombre: Yup.string().required("Nombre es requerido"),
  telefono: Yup.string()
    .matches(/^\d{10}$/, "Teléfono debe tener 10 dígitos")
    .required("Teléfono es requerido"),
  email: Yup.string()
    .matches(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/, "Formato inválido")
    .required("Email es requerido"),
  password: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Debe contener un símbolo")
    .matches(/[0-9]/, "Debe contener un número")
    .matches(/[A-Z]/, "Debe contener una mayúscula")
    .matches(/[a-z]/, "Debe contener una minúscula")
    .required("La contraseña es obligatoria"),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("password")], "Contraseña debe coincidir")
    .required("Confirmación es requerida"),
  lugares: Yup.string().required("Debes seleccionar una ciudad"),
  servicios: Yup.string().required("Debes seleccionar un servicio"),
  experiencia: Yup.string().required("Debes ingresar tu experiencia"),
  check: Yup.boolean().oneOf(
    [true],
    "Debes aceptar los términos y condiciones"
  ),
});

const TecnicoRegistro = () => {
  const [activar, setActivar] = useState("");

  const tecnicoRegistroLink = () => setActivar("activo");
  const tecnicoIniciaSesionLink = () => setActivar("");

  const navigate = useNavigate();

  const onSubmit = async (
    { email, nombre: name, password }: TypeIniditialValues,
    { resetForm }: any
  ) => {
    await fetchRegister({ email, name, password });
    resetForm();
  };

  const fetchRegister = async ({ email, name, password }: RegisterFetch) => {
    try {
      fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, password }),
      })
        .then((r) => r.text())
        .then(console.log);
        
    } catch (e: any) {
      console.error("Register error:", e);
      alert("Error registering user");
      return null;
    }
  };

  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const onLogin = async (event: any) => {
    event.preventDefault();
    await fetchLogin({ email: values.email, password: values.password });
  };

  const fetchLogin = async ({ email, password }: RegisterFetch) => {
    try {
      fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((r) => r.json())
        .then((r: any) => {
          navigate("/tecnico");
        });
    } catch (e: any) {
      console.error("Register error:", e);
      alert("Error registering user");
      return null;
    }
  };
  return (
    <div className="formulario-registro">
      <div className={`tecnico ${activar}`}>
        {/* LOGIN */}
        <div className="box-login-tecnico">
          <div className="icono-tecnico">
            <FaUserCheck />
          </div>

          <form>
            <h1>Iniciar Sesión Técnico</h1>
            <p className="slogan">Encuentra técnicos certificados en FixRD</p>

            <div className="tipo-usuario">
              <p className="link-cliente">
                ¿Eres cliente? <Link to="/login">Ir a Cliente</Link>
              </p>
            </div>

            <div className="input-tecnico">
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                onChange={handleChange}
                value={values.email}
              />
              <MdMarkEmailRead className="icon" />
              <small className="text-red-500">{errors?.email}</small>
            </div>

            <div className="input-tecnico">
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                onChange={handleChange}
                value={values.password}
              />
              <FaLock className="icon" />
            </div>

            <div className="recordad-contrasena">
              <label>
                <input type="checkbox" /> Recordar Contraseña
              </label>
              <a
                href="https://outlook.live.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                ¿Olvidaste la contraseña?
              </a>
            </div>

            <button type="submit" className="btn" onClick={onLogin}>
              Iniciar Sesión
            </button>

            <div className="registro-link-tecnico">
              <p>
                ¿No tienes una cuenta?{" "}
                <a onClick={tecnicoRegistroLink}>Regístrate</a>
              </p>
            </div>
          </form>
        </div>

        {/* REGISTRO */}
        <div className="box-register">
          <form onSubmit={handleSubmit}>
            <div className="icono-tecnico1">
              <FaUserCheck />
            </div>

            <h1>Registro Técnico</h1>
            <p className="slogan">Encuentra técnicos certificados en FixRD</p>

            <div className="fila-doble">
              <div className="input-tecnico">
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  onChange={handleChange}
                  value={values.nombre}
                />
                <FaUserAlt className="icon" />
                <small className="text-red-500">{errors?.nombre}</small>
              </div>

              <div className="input-tecnico">
                <input
                  type="text"
                  name="telefono"
                  placeholder="Teléfono"
                  onChange={handleChange}
                  value={values.telefono}
                />
                <FaPhoneVolume className="icon" />
                <small className="text-red-500">{errors?.telefono}</small>
              </div>
            </div>

            <div className="input-tecnico">
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                onChange={handleChange}
                value={values.email}
              />
              <MdMarkEmailRead className="icon" />
              <small className="text-red-500">{errors?.email}</small>
            </div>

            <div className="fila-doble">
              <div className="input-tecnico">
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  onChange={handleChange}
                  value={values.password}
                />
                <FaLock className="icon" />
                <small className="text-red-500">{errors?.password}</small>
              </div>

              <div className="input-tecnico">
                <input
                  type="password"
                  name="passwordConfirm"
                  placeholder="Confirmación"
                  onChange={handleChange}
                  value={values.passwordConfirm}
                />
                <FaUnlock className="icon" />
                <small className="text-red-500">
                  {errors?.passwordConfirm}
                </small>
              </div>
            </div>

            <div className="input-tecnico">
              <select
                name="lugares"
                value={values.lugares}
                onChange={handleChange}
                className="ciudades"
              >
                <option value="">Ciudades</option>
                <option value="SantoDomingo">Santo Domingo</option>
                <option value="DistritoNacional">Distrito Nacional</option>
                <option value="Santiago">Santiago</option>
                <option value="LaVega">La Vega</option>
                <option value="PuertoPlata">Puerto Plata</option>
              </select>
              <CiLocationOn className="icon" />
              <small className="text-red-500">{errors?.lugares}</small>
            </div>

            <div className="input-tecnico">
              <select
                name="servicios"
                value={values.servicios}
                onChange={handleChange}
                className="servicios"
              >
                <option value="">Servicios</option>
                <option value="Plomeria">Plomería</option>
                <option value="Electricidad">Electricidad</option>
                <option value="MantenimientoGeneral">
                  Mantenimiento general
                </option>
                <option value="RepAire">Rep. Aire Acondicionado</option>
                <option value="OtrosServicios">Otros servicios</option>
              </select>
              <MdHomeRepairService className="icon" />
              <small className="text-red-500">{errors?.servicios}</small>
            </div>

            <label className="label-precio">Precio (RD$)</label>
            <div className="fila-precio">
              <div className="input-precio">
                <input
                  type="number"
                  name="precioMin"
                  placeholder="Precio mínimo"
                  onChange={handleChange}
                  value={values.precioMin}
                />
              </div>

              <div className="input-precio">
                <input
                  type="number"
                  name="precioMax"
                  placeholder="Precio máximo"
                  onChange={handleChange}
                  value={values.precioMax}
                />
              </div>
            </div>

            <div className="input-tecnico-number">
              <input
                type="number"
                name="experiencia"
                placeholder="Años de experiencia"
                onChange={handleChange}
                value={values.experiencia}
              />
              <FaUserAlt className="icon" />
            </div>

            <div className="recordad-contrasena">
              <label>
                <input
                  type="checkbox"
                  name="check"
                  checked={values.check}
                  onChange={handleChange}
                />
                Acepto los términos y condiciones
              </label>
              <small className="text-red-500">{errors?.check}</small>
            </div>

            <button type="submit" className="btn">
              Registrarse
            </button>

            <div className="registro-link-tecnico">
              <p>
                ¿Ya tienes una cuenta?{" "}
                <a onClick={tecnicoIniciaSesionLink}>Iniciar Sesión</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TecnicoRegistro;
