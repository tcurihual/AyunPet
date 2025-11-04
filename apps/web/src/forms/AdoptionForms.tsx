import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';

const adoptionFormSchema = z.object({
  fullName: z.string().min(3, 'El nombre completo es requerido'),
  phone: z.string().min(9, 'Ingresa un teléfono válido'),
  address: z.string().min(10, 'Ingresa tu dirección completa'),
  city: z.string().min(3, 'Ingresa tu ciudad'),
  
  housingType: z.enum(['casa', 'departamento', 'otro'], {
    errorMap: () => ({ message: 'Selecciona un tipo de vivienda' })
  }),
  housingOwnership: z.enum(['propia', 'arrendada', 'familiar'], {
    errorMap: () => ({ message: 'Selecciona el tipo de propiedad' })
  }),
  hasYard: z.enum(['si', 'no'], {
    errorMap: () => ({ message: 'Indica si tienes patio' })
  }),
  
  hasPets: z.enum(['si', 'no'], {
    errorMap: () => ({ message: 'Indica si tienes otras mascotas' })
  }),
  petsDescription: z.string().optional(),
  hadPetsBefore: z.enum(['si', 'no'], {
    errorMap: () => ({ message: 'Indica si has tenido mascotas antes' })
  }),
  
  familyMembers: z.string().min(1, 'Indica cuántas personas viven contigo'),
  hasChildren: z.enum(['si', 'no'], {
    errorMap: () => ({ message: 'Indica si hay niños en el hogar' })
  }),
  childrenAges: z.string().optional(),
  allAgree: z.enum(['si', 'no'], {
    errorMap: () => ({ message: 'Indica si todos están de acuerdo' })
  }),
  
  timeAvailable: z.enum(['mucho', 'medio', 'poco'], {
    errorMap: () => ({ message: 'Indica cuánto tiempo tienes disponible' })
  }),
  whoWillCare: z.string().min(3, 'Indica quién cuidará a la mascota'),
  veterinaryBudget: z.enum(['si', 'no'], {
    errorMap: () => ({ message: 'Indica si tienes presupuesto para veterinario' })
  }),
  
  whyAdopt: z.string()
    .min(50, 'Por favor, explica con más detalle (mínimo 50 caracteres)')
    .max(500, 'Máximo 500 caracteres'),
  
  acceptTerms: z.boolean()
    .refine(val => val === true, 'Debes aceptar los términos y condiciones'),
  acceptHomeVisit: z.boolean()
    .refine(val => val === true, 'Debes aceptar la visita domiciliaria'),
});

type AdoptionFormData = z.infer<typeof adoptionFormSchema>;

const AdoptionForm: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isLoading, setLoading } = useLoading();
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<AdoptionFormData>({
    resolver: zodResolver(adoptionFormSchema),
    defaultValues: {
      fullName: user?.name || '',
    }
  });

  const hasPets = watch('hasPets');
  const hasChildren = watch('hasChildren');

  const onSubmit = async (data: AdoptionFormData) => {
    setLoading(true);
    try {
      console.log('Solicitud de adopción:', {
        ...data,
        petId,
        userId: user?.id,
        submittedAt: new Date().toISOString()
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      setSubmitSuccess(true);

      setTimeout(() => {
        navigate('/solicitudes');
      }, 3000);

    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      alert('Error al enviar la solicitud. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (submitSuccess) {
    return (
      <div style={{ maxWidth: '600px', margin: '50px auto', textAlign: 'center', padding: '20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
        <h2 style={{ color: '#4caf50', marginBottom: '15px' }}>¡Solicitud enviada exitosamente!</h2>
        <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6' }}>
          Tu solicitud de adopción ha sido enviada a la organización.
          <br />
          Recibirás una notificación cuando revisen tu solicitud.
        </p>
        <p style={{ fontSize: '14px', color: '#888', marginTop: '20px' }}>
          Serás redirigido a tus solicitudes en unos segundos...
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px' }}>
      <div style={{ 
        backgroundColor: '#fff', 
        borderRadius: '12px', 
        padding: '40px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ marginBottom: '10px', color: '#4f4641' }}>Solicitud de Adopción</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Por favor completa el siguiente formulario con información verídica. 
          Esta información nos ayudará a encontrar el mejor hogar para nuestras mascotas.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          
          <div style={{ marginBottom: '35px' }}>
            <h3 style={{ 
              color: '#4f4641', 
              borderBottom: '2px solid #f2e8d5',
              paddingBottom: '10px',
              marginBottom: '20px'
            }}>
              1. Información Personal
            </h3>
            
            <div className="form-group">
              <label htmlFor="fullName">Nombre completo *</label>
              <input
                type="text"
                id="fullName"
                placeholder="Ej: Juan Pérez González"
                {...register('fullName')}
                disabled={isLoading}
              />
              {errors.fullName && <p className="error-message">{errors.fullName.message}</p>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label htmlFor="phone">Teléfono *</label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="+56 9 1234 5678"
                  {...register('phone')}
                  disabled={isLoading}
                />
                {errors.phone && <p className="error-message">{errors.phone.message}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="city">Ciudad *</label>
                <input
                  type="text"
                  id="city"
                  placeholder="Ej: Temuco"
                  {...register('city')}
                  disabled={isLoading}
                />
                {errors.city && <p className="error-message">{errors.city.message}</p>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Dirección completa *</label>
              <input
                type="text"
                id="address"
                placeholder="Calle, número, comuna"
                {...register('address')}
                disabled={isLoading}
              />
              {errors.address && <p className="error-message">{errors.address.message}</p>}
            </div>
          </div>

          <div style={{ marginBottom: '35px' }}>
            <h3 style={{ 
              color: '#4f4641', 
              borderBottom: '2px solid #f2e8d5',
              paddingBottom: '10px',
              marginBottom: '20px'
            }}>
              2. Situación Habitacional
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label htmlFor="housingType">Tipo de vivienda *</label>
                <select id="housingType" {...register('housingType')} disabled={isLoading}>
                  <option value="">Selecciona...</option>
                  <option value="casa">Casa</option>
                  <option value="departamento">Departamento</option>
                  <option value="otro">Otro</option>
                </select>
                {errors.housingType && <p className="error-message">{errors.housingType.message}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="housingOwnership">La vivienda es *</label>
                <select id="housingOwnership" {...register('housingOwnership')} disabled={isLoading}>
                  <option value="">Selecciona...</option>
                  <option value="propia">Propia</option>
                  <option value="arrendada">Arrendada</option>
                  <option value="familiar">Familiar</option>
                </select>
                {errors.housingOwnership && <p className="error-message">{errors.housingOwnership.message}</p>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="hasYard">¿Tienes patio o espacio exterior? *</label>
              <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="radio" value="si" {...register('hasYard')} disabled={isLoading} />
                  <span style={{ marginLeft: '8px' }}>Sí</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="radio" value="no" {...register('hasYard')} disabled={isLoading} />
                  <span style={{ marginLeft: '8px' }}>No</span>
                </label>
              </div>
              {errors.hasYard && <p className="error-message">{errors.hasYard.message}</p>}
            </div>
          </div>

          <div style={{ marginBottom: '35px' }}>
            <h3 style={{ 
              color: '#4f4641', 
              borderBottom: '2px solid #f2e8d5',
              paddingBottom: '10px',
              marginBottom: '20px'
            }}>
              3. Experiencia con Mascotas
            </h3>

            <div className="form-group">
              <label htmlFor="hasPets">¿Actualmente tienes otras mascotas? *</label>
              <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="radio" value="si" {...register('hasPets')} disabled={isLoading} />
                  <span style={{ marginLeft: '8px' }}>Sí</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="radio" value="no" {...register('hasPets')} disabled={isLoading} />
                  <span style={{ marginLeft: '8px' }}>No</span>
                </label>
              </div>
              {errors.hasPets && <p className="error-message">{errors.hasPets.message}</p>}
            </div>

            {hasPets === 'si' && (
              <div className="form-group">
                <label htmlFor="petsDescription">Describe tus mascotas actuales</label>
                <textarea
                  id="petsDescription"
                  rows={3}
                  placeholder="Ej: Tengo un perro labrador de 5 años y un gato mestizo de 2 años"
                  {...register('petsDescription')}
                  disabled={isLoading}
                  style={{ resize: 'vertical' }}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="hadPetsBefore">¿Has tenido mascotas anteriormente? *</label>
              <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="radio" value="si" {...register('hadPetsBefore')} disabled={isLoading} />
                  <span style={{ marginLeft: '8px' }}>Sí</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="radio" value="no" {...register('hadPetsBefore')} disabled={isLoading} />
                  <span style={{ marginLeft: '8px' }}>No</span>
                </label>
              </div>
              {errors.hadPetsBefore && <p className="error-message">{errors.hadPetsBefore.message}</p>}
            </div>
          </div>

          <div style={{ marginBottom: '35px' }}>
            <h3 style={{ 
              color: '#4f4641', 
              borderBottom: '2px solid #f2e8d5',
              paddingBottom: '10px',
              marginBottom: '20px'
            }}>
              4. Situación Familiar
            </h3>

            <div className="form-group">
              <label htmlFor="familyMembers">¿Cuántas personas viven en tu hogar? *</label>
              <input
                type="number"
                id="familyMembers"
                min="1"
                placeholder="Ej: 4"
                {...register('familyMembers')}
                disabled={isLoading}
              />
              {errors.familyMembers && <p className="error-message">{errors.familyMembers.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="hasChildren">¿Hay niños en el hogar? *</label>
              <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="radio" value="si" {...register('hasChildren')} disabled={isLoading} />
                  <span style={{ marginLeft: '8px' }}>Sí</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="radio" value="no" {...register('hasChildren')} disabled={isLoading} />
                  <span style={{ marginLeft: '8px' }}>No</span>
                </label>
              </div>
              {errors.hasChildren && <p className="error-message">{errors.hasChildren.message}</p>}
            </div>

            {hasChildren === 'si' && (
              <div className="form-group">
                <label htmlFor="childrenAges">Edades de los niños</label>
                <input
                  type="text"
                  id="childrenAges"
                  placeholder="Ej: 5, 8 y 12 años"
                  {...register('childrenAges')}
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="allAgree">¿Todos en la familia están de acuerdo con la adopción? *</label>
              <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="radio" value="si" {...register('allAgree')} disabled={isLoading} />
                  <span style={{ marginLeft: '8px' }}>Sí</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="radio" value="no" {...register('allAgree')} disabled={isLoading} />
                  <span style={{ marginLeft: '8px' }}>No</span>
                </label>
              </div>
              {errors.allAgree && <p className="error-message">{errors.allAgree.message}</p>}
            </div>
          </div>

          {/* SECCIÓN 5: Compromiso y Cuidados */}
          <div style={{ marginBottom: '35px' }}>
            <h3 style={{ 
              color: '#4f4641', 
              borderBottom: '2px solid #f2e8d5',
              paddingBottom: '10px',
              marginBottom: '20px'
            }}>
              5. Compromiso y Cuidados
            </h3>

            <div className="form-group">
              <label htmlFor="timeAvailable">¿Cuánto tiempo tienes disponible para la mascota? *</label>
              <select id="timeAvailable" {...register('timeAvailable')} disabled={isLoading}>
                <option value="">Selecciona...</option>
                <option value="mucho">Mucho tiempo (trabajo desde casa o tiempo flexible)</option>
                <option value="medio">Tiempo medio (algunas horas al día)</option>
                <option value="poco">Poco tiempo (trabajo fuera todo el día)</option>
              </select>
              {errors.timeAvailable && <p className="error-message">{errors.timeAvailable.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="whoWillCare">¿Quién será el responsable principal del cuidado? *</label>
              <input
                type="text"
                id="whoWillCare"
                placeholder="Ej: Yo seré el responsable principal"
                {...register('whoWillCare')}
                disabled={isLoading}
              />
              {errors.whoWillCare && <p className="error-message">{errors.whoWillCare.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="veterinaryBudget">¿Cuentas con presupuesto para gastos veterinarios? *</label>
              <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="radio" value="si" {...register('veterinaryBudget')} disabled={isLoading} />
                  <span style={{ marginLeft: '8px' }}>Sí</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="radio" value="no" {...register('veterinaryBudget')} disabled={isLoading} />
                  <span style={{ marginLeft: '8px' }}>No</span>
                </label>
              </div>
              {errors.veterinaryBudget && <p className="error-message">{errors.veterinaryBudget.message}</p>}
            </div>
          </div>

          {/* SECCIÓN 6: Motivación */}
          <div style={{ marginBottom: '35px' }}>
            <h3 style={{ 
              color: '#4f4641', 
              borderBottom: '2px solid #f2e8d5',
              paddingBottom: '10px',
              marginBottom: '20px'
            }}>
              6. Motivación
            </h3>

            <div className="form-group">
              <label htmlFor="whyAdopt">¿Por qué quieres adoptar esta mascota? * (50-500 caracteres)</label>
              <textarea
                id="whyAdopt"
                rows={5}
                placeholder="Cuéntanos por qué quieres adoptar y qué puedes ofrecer a esta mascota..."
                {...register('whyAdopt')}
                disabled={isLoading}
                style={{ resize: 'vertical' }}
              />
              {errors.whyAdopt && <p className="error-message">{errors.whyAdopt.message}</p>}
              <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                {watch('whyAdopt')?.length || 0} / 500 caracteres
              </p>
            </div>
          </div>

          {/* SECCIÓN 7: Términos y Condiciones */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ 
              color: '#4f4641', 
              borderBottom: '2px solid #f2e8d5',
              paddingBottom: '10px',
              marginBottom: '20px'
            }}>
              7. Términos y Condiciones
            </h3>

            <div className="terms-group">
              <input
                type="checkbox"
                id="acceptTerms"
                {...register('acceptTerms')}
                disabled={isLoading}
              />
              <label htmlFor="acceptTerms">
                Acepto que la información proporcionada es verídica y entiendo que la adopción está sujeta a aprobación. *
              </label>
            </div>
            {errors.acceptTerms && <p className="error-message terms-error">{errors.acceptTerms.message}</p>}

            <div className="terms-group">
              <input
                type="checkbox"
                id="acceptHomeVisit"
                {...register('acceptHomeVisit')}
                disabled={isLoading}
              />
              <label htmlFor="acceptHomeVisit">
                Acepto recibir una visita domiciliaria como parte del proceso de adopción. *
              </label>
            </div>
            {errors.acceptHomeVisit && <p className="error-message terms-error">{errors.acceptHomeVisit.message}</p>}
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando solicitud...' : 'Enviar Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdoptionForm;