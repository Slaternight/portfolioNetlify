import React, { useState } from 'react';

function contact() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Netlify Forms requiere un atributo 'data-netlify="true"' en el formulario
    // y los campos deben tener un atributo 'name'
    // Además, para que funcione correctamente con React, es mejor enviar los datos
    // como un FormData object.

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      });

      if (response.ok) {
        alert('¡Formulario enviado con éxito!');
        setFormData({ nombre: '', email: '', mensaje: '' }); // Limpiar el formulario
      } else {
        alert('Hubo un problema al enviar el formulario.');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Ocurrió un error. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <form name="contacto" method="POST" data-netlify="true" onSubmit={handleSubmit}>
      <p>
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </p>
      <p>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </p>
      <p>
        <label htmlFor="mensaje">Mensaje:</label>
        <textarea
          id="mensaje"
          name="mensaje"
          value={formData.mensaje}
          onChange={handleChange}
          required
        ></textarea>
      </p>
      <p>
        <button type="submit">Enviar</button>
      </p>
    </form>
  );
}

export default contact;