import React from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  { question: "¿Qué es Ayün Pet?", 
    answer: "Ayün Pet es una plataforma que facilita el proceso de adopción de mascotas." },

  { question: "¿Como empiezo a adoptar una mascota?",
    answer: "Una vez hayas creado una cuenta en Ayün Pet, podras elegir una mascota y deberas responder un formulario del dueño o refugio en cual se determinara si tu solicitud es valida y entres en el proceso de adopción ." },

  { question: "¿Qué requisitos debo cumplir para adoptar una mascota?", 
    answer: "Los requisitos principales para poder adoptar son: Ser mayor de edad, No haber tenido problemas con mascotas anteriores y tener un espacio en el cual se pueda tener una mascota." },

  {
    question: "¿Se cobra alguna tarifa por la adopción?",
    answer: "En Ayün Pet se puede solicitar una tarifa simbólica para cubrir gastos básicos de veterinaria, alimentación y cuidados, pero siempre se comunica de manera clara antes de formalizar el proceso."
  },
  {
    question: "¿Puedo devolver una mascota si no me adapto a ella?",
    answer: "Sabemos que la adaptación puede ser difícil en ocasiones. En Ayün Pet brindamos acompañamiento y, en caso necesario, podemos gestionar el regreso de la mascota para asegurar su bienestar."
  },
  {
    question: "¿Ayün Pet realiza seguimiento después de la adopción?",
    answer: "Sí, nuestro equipo realiza seguimiento y asesoría durante el proceso de adaptación, ofreciendo apoyo y respondiendo inquietudes para asegurar el bienestar de la mascota y su nueva familia."
  },
  {
    question: "¿Puedo devolver una mascota si no me adapto a ella?",
    answer: "Sí, en caso de que la adaptación no sea posible, Ayün Pet siempre prioriza el bienestar de la mascota y su entorno, pudiendo coordinar su retorno y buscarle otra familia."
  },
  {
    question: "¿Qué pasos siguen después de enviar mi solicitud de adopción?",
    answer: "Después de enviar tu solicitud, el equipo de Ayün Pet revisará los datos y te contactará para coordinar entrevistas, visitas y resolver cualquier duda antes de concretar la adopción."
  },
  {
    question: "¿Las mascotas están vacunadas y desparasitadas antes de la adopción?",
    answer: "Sí, todas las mascotas disponibles en Ayün Pet cuentan con sus vacunas y desparasitaciones al día, garantizando que estén saludables y listas para su nuevo hogar."
  },

  { question: "¿Puedo adoptar más de una mascota al mismo tiempo?", //10
    answer: "Si, Es posible adoptar más de una mascota al mismo tiempo." },

  { question: "¿Ayün Pet ofrece asesoría o acompañamiento sobre el cuidado de la mascota adoptada?", 
    answer: "No, Ayün Pet no ofrece asesoría directa sobre como debe ser el cuidado de la mascota." },

  { question: "¿Existen campañas de adopción o eventos especiales en Ayunpet?", 
    answer: "Hasta el momento, Ayunpet no tiene y tampoco esta planeando agregar eventos especiales dentro de la plataforma." },

  { question: "¿Las mascotas están esterilizadas/castradas antes de ser entregadas?", 
    answer: "Los datos sobre su esterilización siempre es visible en la información de la mascota para adoptar." },

  { question: "¿Cómo puedo saber la personalidad o comportamiento de una mascota antes de adoptarla?", 
    answer: "Los dueños o los refugios siempre dejan información relevante sobre su comportamiento." },

  { question: "¿Cuánto tiempo tarda el proceso completo de adopción en Ayün Pet?", 
    answer: "Suele tardar de 1 a 3 semanas, el tiempo dependera de la respuesta de los dueños o refugios de las mascotas." }
];

const Faq: React.FC = () => {
  return (
    <section className="faq-section" id="faq">
      <h2>Preguntas frecuentes sobre adopción</h2>
      <div className="faq-container">
        {faqData.map((item, index) => (
          <details key={index}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
};

export default Faq;