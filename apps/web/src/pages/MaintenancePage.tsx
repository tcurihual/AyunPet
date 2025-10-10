import React from "react"
const Maintenance: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-xl text-center">
                <div className="w-20 h-20 bg-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-4xl">🐾</span>
                </div>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    Ayün Pet
                </h1>
                
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Estamos en Mantenimiento
                </h2>
                
                <p className="text-gray-600 mb-6">
                    Estamos mejorando nuestro sitio. Volveremos pronto.
                </p>
                
                <div className="bg-gray-200 rounded-full h-2 mb-6">
                    <div className="bg-indigo-600 h-2 rounded-full w-3/4 animate-pulse"></div>
                </div>
                
                <a href="mailto:contacto@ayunpet.com" className="text-indigo-600 hover:underline">
                    contacto@ayunpet.com
                </a>
            </div>
        </div>
    )
}

export default Maintenance